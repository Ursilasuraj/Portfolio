// Theme switcher (dark / light) — a single sun/moon toggle button.
//
// The actual FOUC-prevention (setting data-theme before first paint) happens in a tiny
// blocking inline <script> at the top of each page's <head> — see the "theme init" comment
// near the top of any .html file. This file only wires up the button after the DOM is ready;
// it re-reads the same localStorage key so the two stay in sync.
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');

function applyTheme(theme) {
  const normalized = theme === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', normalized);
  if (toggle) {
    toggle.setAttribute('aria-label', normalized === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  localStorage.setItem('portfolio-theme', normalized);
}

// Sync with whatever the inline head script already applied (it may have used a saved
// value or the OS preference) rather than re-deciding from scratch.
applyTheme(root.getAttribute('data-theme') || 'dark');

if (toggle) {
  toggle.addEventListener('click', () => {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
}
