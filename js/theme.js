// Theme switcher (dark / pastel / light-blue), driven by a single <select>.
//
// The actual FOUC-prevention (setting data-theme before first paint) happens in a tiny
// blocking inline <script> at the top of each page's <head> — see the "theme init" comment
// near the top of any .html file. This file only wires up the select after the DOM is ready;
// it re-reads the same localStorage key so the two stay in sync.
const root = document.documentElement;
const select = document.querySelector('.theme-select');

function normalizeThemeName(name) {
  if (!name) return 'dark';
  return String(name).toLowerCase().replace(/\s+/g, '-');
}

function applyTheme(theme) {
  const normalized = normalizeThemeName(theme);
  root.setAttribute('data-theme', normalized);
  if (select) select.value = normalized;
  localStorage.setItem('portfolio-theme', normalized);
}

// Sync with whatever the inline head script already applied (it may have used a saved
// value or the OS preference) rather than re-deciding from scratch.
applyTheme(root.getAttribute('data-theme') || 'dark');

if (select) {
  select.addEventListener('change', () => applyTheme(select.value));
}
