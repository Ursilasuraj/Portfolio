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

    actions.querySelectorAll('a, button.theme-btn, button.lang-btn').forEach((el) => {
      el.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 720px)').matches && el.tagName === 'A') {
          actions.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

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
    const target = link.getAttribute('href');
    if (target === here || (here === 'index.html' && target === './')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
