// Theme switcher (dark / pastel / light-blue).
//
// The actual FOUC-prevention (setting data-theme before first paint) happens in a tiny
// blocking inline <script> at the top of each page's <head> — see the "theme init" comment
// near the top of any .html file. This file only wires up the theme-switcher buttons after
// the DOM is ready; it re-reads the same localStorage key so the two stay in sync.
const root = document.documentElement;
const themeButtons = document.querySelectorAll('.theme-btn');

function normalizeThemeName(name) {
  if (!name) return 'dark';
  return String(name).toLowerCase().replace(/\s+/g, '-');
}

function applyTheme(theme) {
  const normalized = normalizeThemeName(theme);
  root.setAttribute('data-theme', normalized);
  themeButtons.forEach((button) => {
    const btnTheme = normalizeThemeName(button.dataset.themeOption);
    const isActive = btnTheme === normalized;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-checked', String(isActive));
  });
  localStorage.setItem('portfolio-theme', normalized);
}

// Sync with whatever the inline head script already applied (it may have used a saved
// value or the OS preference) rather than re-deciding from scratch.
applyTheme(root.getAttribute('data-theme') || 'dark');

themeButtons.forEach((button, index) => {
  button.addEventListener('click', () => applyTheme(button.dataset.themeOption));

  // role="radio" implies arrow-key navigation between options (WAI-ARIA radio group pattern).
  button.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const dir = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = (index + dir + themeButtons.length) % themeButtons.length;
    themeButtons[next].focus();
    applyTheme(themeButtons[next].dataset.themeOption);
  });
});
