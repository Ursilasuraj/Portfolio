// Reveals the private assets (photos, CV downloads) after the visitor enters the access key.
//
// These assets ship as AES-GCM ciphertext (see tools/encrypt-assets.mjs) — the plaintext is not
// in the repo and not on the network until a correct key decrypts it client-side. The key is
// never stored or compared anywhere: it's run through PBKDF2 to derive an AES key, and a wrong
// key simply fails GCM's authentication tag, so there is nothing to "read out" of the source.
//
// Elements opt in with data-private="<manifest key>":
//   <img data-private="photo-hiking">        → src becomes an object URL
//   <a   data-private="cv-en">               → href becomes an object URL + download name
// Anything inside [data-private-hidden] is display:none until unlocked.
(function () {
  const STORAGE_KEY = 'portfolio-unlocked';
  const MANIFEST_URL = 'assets/private/manifest.json';
  const PRIVATE_DIR = 'assets/private/';

  const targets = Array.from(document.querySelectorAll('[data-private]'));
  const gate = document.querySelector('[data-unlock-gate]');
  if (!targets.length && !gate) return;

  const form = gate ? gate.querySelector('[data-unlock-form]') : null;
  const input = gate ? gate.querySelector('[data-unlock-input]') : null;
  const status = gate ? gate.querySelector('[data-unlock-status]') : null;
  const openBtn = gate ? gate.querySelector('[data-unlock-open]') : null;
  const cancelBtn = gate ? gate.querySelector('[data-unlock-cancel]') : null;

  let manifestPromise = null;
  const loadManifest = () => {
    if (!manifestPromise) {
      manifestPromise = fetch(MANIFEST_URL).then((r) => {
        if (!r.ok) throw new Error('manifest unavailable');
        return r.json();
      });
    }
    return manifestPromise;
  };

  function setStatus(msg, isError) {
    if (!status) return;
    status.textContent = msg;
    status.dataset.state = isError ? 'error' : 'info';
  }

  async function deriveKey(password, salt, kdf) {
    const material = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: kdf.iterations, hash: kdf.hash },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  }

  // Layout must match tools/encrypt-assets.mjs: salt ‖ iv ‖ ciphertext(+tag)
  async function decryptAsset(entry, password, kdf) {
    const res = await fetch(PRIVATE_DIR + entry.file);
    if (!res.ok) throw new Error('asset unavailable: ' + entry.file);
    const buf = new Uint8Array(await res.arrayBuffer());
    const salt = buf.slice(0, kdf.saltBytes);
    const iv = buf.slice(kdf.saltBytes, kdf.saltBytes + kdf.ivBytes);
    const ciphertext = buf.slice(kdf.saltBytes + kdf.ivBytes);
    const key = await deriveKey(password, salt, kdf);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return URL.createObjectURL(new Blob([plain], { type: entry.type }));
  }

  function applyUrl(el, url, entry) {
    if (el.tagName === 'IMG') {
      el.src = url;
      el.removeAttribute('data-private-placeholder');
      // alt is blank in the HTML (see index.html) so View Source can't describe a photo
      // that isn't showing — the real description lives only in manifest.json, which
      // itself is never fetched until an unlock attempt happens. Restore it now.
      if (entry.alt) el.alt = entry.alt;
    } else if (el.tagName === 'A') {
      el.href = url;
      if (entry.download) el.setAttribute('download', entry.download);
      el.removeAttribute('aria-disabled');
      el.classList.remove('is-locked');
    }
  }

  async function unlock(password, { silent } = {}) {
    const manifest = await loadManifest();
    const kdf = manifest.kdf;

    // Decrypt one asset first: if the key is wrong this throws before we've done the work
    // for every file, and before anything is shown.
    const names = Array.from(new Set(targets.map((el) => el.dataset.private)));
    const cache = {};
    const [first, ...rest] = names;
    cache[first] = await decryptAsset(manifest.assets[first], password, kdf);
    await Promise.all(
      rest.map(async (n) => {
        cache[n] = await decryptAsset(manifest.assets[n], password, kdf);
      })
    );

    targets.forEach((el) => applyUrl(el, cache[el.dataset.private], manifest.assets[el.dataset.private]));
    document.querySelectorAll('[data-private-hidden]').forEach((el) => {
      el.removeAttribute('data-private-hidden');
    });
    document.documentElement.setAttribute('data-unlocked', 'true');
    if (gate) gate.hidden = true;
    if (!silent) setStatus('', false);
  }

  // Re-unlock silently on later visits (persisted per device, by choice).
  if (localStorage.getItem(STORAGE_KEY)) {
    const saved = localStorage.getItem(STORAGE_KEY);
    unlock(saved, { silent: true }).catch(() => {
      // Stored key no longer decrypts (assets re-encrypted with a new key) — forget it.
      localStorage.removeItem(STORAGE_KEY);
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      gate.dataset.open = 'true';
      if (input) input.focus();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      gate.removeAttribute('data-open');
      setStatus('', false);
      if (input) input.value = '';
      if (openBtn) openBtn.focus();
    });
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const password = input.value;
      if (!password) return;
      setStatus('Checking…', false);
      try {
        await unlock(password);
        localStorage.setItem(STORAGE_KEY, password);
      } catch (err) {
        // Wrong key and a missing/corrupt file are deliberately reported the same way, so the
        // message never confirms whether a given asset exists.
        setStatus('That key is not correct.', true);
        input.select();
      }
    });
  }
})();
