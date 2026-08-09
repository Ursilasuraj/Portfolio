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
  const langButtons = document.querySelectorAll('.lang-btn');
  const nodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const englishCache = new Map(nodes.map((el) => [el, el.innerHTML]));

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
    langButtons.forEach((btn) => {
      const isActive = btn.dataset.langOption === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });
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
  if (saved === 'de') setLang('de');

  langButtons.forEach((button, index) => {
    button.addEventListener('click', () => setLang(button.dataset.langOption));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const dir = event.key === 'ArrowRight' ? 1 : -1;
      const next = (index + dir + langButtons.length) % langButtons.length;
      langButtons[next].focus();
      setLang(langButtons[next].dataset.langOption);
    });
  });
})();
