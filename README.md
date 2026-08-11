# Ursila Pradeep Vadakkumpuram — Portfolio

Personal portfolio site: [ursilasuraj.github.io/Portfolio](https://ursilasuraj.github.io/Portfolio/)

Static HTML/CSS/JS, no build step, no framework. Deployable as-is to GitHub Pages.

## Structure

```
index.html          Homepage — hero, about, projects, experience, skills, hobbies
projects.html        Full project catalogue, incl. 42 Heilbronn common core
experience.html       education.html       skills.html       contact.html
404.html

styles.css           Single stylesheet — CSS custom-property tokens per theme
js/theme.js          Dark / Pastel Green / Light Blue switcher
js/nav.js            Mobile nav toggle + aria-current
js/i18n.js           EN/DE toggle (English lives in the HTML; German loads from i18n/de.json)
i18n/de.json          German translations, keyed by data-i18n attribute

assets/private/       Encrypted photos + CV PDFs (*.enc) — the only published form
assets/fonts/          Self-hosted Inter (OFL-1.1, see INTER-LICENSE.txt)
assets/photos/, assets/cv/   Plaintext build inputs — gitignored, never published

tools/optimize-images.mjs   Resize + strip metadata from source photos → assets/photos/
tools/build-cv-pdf.mjs      Render tools/cv-source-*.html → assets/cv/*.pdf via Chromium
tools/encrypt-assets.mjs    Encrypt photos + CV PDFs → assets/private/*.enc
js/unlock.js                Key prompt + in-browser decryption of the private assets
```

## Local development

No build step — just serve the directory and open it:

```
python3 -m http.server 8000
```

## Private assets (photos + CV)

On this branch the photos and CV PDFs are **not** published in plaintext. They ship as
AES-GCM ciphertext in `assets/private/*.enc`, and `js/unlock.js` decrypts them in the browser
after the visitor enters the access key.

The key is never stored in the repo. It is used at build time to derive an encryption key
(PBKDF2-SHA256, 600k iterations, fresh salt + IV per file), and the browser re-derives the same
key from whatever is typed. A wrong key fails AES-GCM's authentication tag, so nothing is
revealed — unlike a JavaScript `if (input === password)` check, where the password is readable
in the source no matter how it's obfuscated.

**What this does and doesn't protect.** It stops the photos and CV being served to anyone who
visits the site without the key. It does **not** retroactively protect files that were already
published: earlier commits on other branches still contain the plaintext photos and PDFs, and
this is a public repository. Removing those requires rewriting git history (destructive,
force-push) — not done here.

To regenerate after changing a photo or the CV:

```
npm install sharp playwright-core to-ico      # dev-only, node_modules/ is gitignored

# 1. put the plaintext sources back in assets/photos/ and assets/cv/ (both gitignored)
node tools/optimize-images.mjs
CHROMIUM_PATH=/path/to/chrome node tools/build-cv-pdf.mjs

# 2. re-encrypt, then delete the plaintext again before committing
PORTFOLIO_KEY='<the access key>' node tools/encrypt-assets.mjs
```

`tools/cv-source-en.html` / `tools/cv-source-de.html` are the CV layouts Chromium prints from.
They live under `tools/` rather than at the site root deliberately — served at the root they
would expose the full CV to anyone, defeating the gate.

## Content status

See `CONTENT-TODO.md` for the open items — mainly which 42 Heilbronn projects are finished
(with repo links) and a few numbers that would strengthen the experience section.
