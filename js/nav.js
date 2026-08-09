// Mobile nav toggle + marks the current page's nav link with aria-current="page".
// Computed here (rather than hardcoded per page) so every page's nav markup stays identical
// and there's no risk of one page shipping a stale "active" link.
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const actions = document.querySelector('.nav-actions');

  if (toggle && actions) {
    toggle.addEventListener('click', () => {
      const isOpen = actions.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    const closeOnMobile = () => {
      if (window.matchMedia('(max-width: 720px)').matches) {
        actions.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    };

    actions.querySelectorAll('.nav-links a').forEach((el) => el.addEventListener('click', closeOnMobile));
    actions.querySelectorAll('select.theme-select').forEach((el) => el.addEventListener('change', closeOnMobile));
    actions.querySelectorAll('button.lang-toggle').forEach((el) => el.addEventListener('click', closeOnMobile));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && actions.classList.contains('is-open')) {
        actions.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  const here = (location.pathname.split('/').pop() || 'index.html').replace(/^$/, 'index.html');
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.getAttribute('href') === here) link.setAttribute('aria-current', 'page');
  });
  // "Home" isn't in the link list (the logo already covers it) — mark the brand link current
  // on the homepage so it gets the same visual/semantic treatment as any other active page.
  if (here === 'index.html') {
    const brand = document.querySelector('.brand');
    if (brand) brand.setAttribute('aria-current', 'page');
  }
})();
