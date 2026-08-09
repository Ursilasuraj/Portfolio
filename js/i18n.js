// EN/DE toggle. English lives directly in the HTML (the source of truth — it's what a
// visitor with JS disabled sees, and it's what search engines index); German is a
// progressive-enhancement layer swapped in from i18n/de.json after the page loads.
//
// Elements to translate carry data-i18n="some.key"; their *current* (English) innerHTML is
// cached here on first run so switching back to EN never needs its own copy maintained
// separately from the markup.
(function () {
  const STORAGE_KEY = 'portfolio-lang';
  const root = document.documentElement;
  const toggle = document.querySelector('.lang-toggle');
  const nodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const englishCache = new Map(nodes.map((el) => [el, el.innerHTML]));

  const LABEL = { en: { self: 'EN', switchTo: 'Switch to German' }, de: { self: 'DE', switchTo: 'Switch to English' } };

  let dict = null;
  let dictPromise = null;

  function loadDict() {
    if (!dictPromise) {
      // Path is relative to the page, same as every other asset link on these pages.
      dictPromise = fetch('i18n/de.json')
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error('i18n fetch failed'))))
        .then((json) => {
          dict = json;
          return json;
        })
        .catch(() => {
          // No network / opened via file:// / JSON missing — fail quiet and stay in English.
          dict = null;
          return null;
        });
    }
    return dictPromise;
  }

  function render(lang) {
    nodes.forEach((el) => {
      const key = el.dataset.i18n;
      if (lang === 'de' && dict && dict[key] != null) {
        el.innerHTML = dict[key];
      } else {
        el.innerHTML = englishCache.get(el);
      }
    });
    root.setAttribute('lang', lang);
    if (toggle) {
      // Button shows the *other* language — the one you'd switch to.
      const other = lang === 'en' ? 'de' : 'en';
      toggle.textContent = LABEL[other].self;
      toggle.setAttribute('aria-label', LABEL[lang].switchTo);
      toggle.dataset.langCurrent = lang;
    }
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    if (lang === 'de') {
      loadDict().then(() => render('de'));
    } else {
      render('en');
    }
  }

  const saved = localStorage.getItem(STORAGE_KEY) || (navigator.language || '').slice(0, 2);
  if (saved === 'de') {
    setLang('de');
  } else {
    render('en');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = toggle.dataset.langCurrent === 'de' ? 'en' : 'de';
      setLang(next);
    });
  }
})();
