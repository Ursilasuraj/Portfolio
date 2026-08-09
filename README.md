# Ursila Pradeep Vadakkumpuram — Portfolio

Personal portfolio site: [ursilasuraj.github.io/Portfolio](https://ursilasuraj.github.io/Portfolio/)

Static HTML/CSS/JS, no build step, no framework. Deployable as-is to GitHub Pages.

## Structure

```
index.html          Homepage — hero, about, projects, experience, skills, hobbies
projects.html        Full project catalogue, incl. 42 Heilbronn common core
experience.html       education.html       skills.html       contact.html
cv.html / cv-de.html  Print-ready CV (also the source Chromium prints to PDF)
404.html

styles.css           Single stylesheet — CSS custom-property tokens per theme
js/theme.js          Dark / Pastel Green / Light Blue switcher
js/nav.js            Mobile nav toggle + aria-current
js/i18n.js           EN/DE toggle (English lives in the HTML; German loads from i18n/de.json)
i18n/de.json          German translations, keyed by data-i18n attribute

assets/photos/        Optimized site images (WebP + JPEG, EXIF stripped)
assets/fonts/          Self-hosted Inter (OFL-1.1, see INTER-LICENSE.txt)
assets/cv/             Generated CV PDFs — do not hand-edit, regenerate instead (see below)

tools/optimize-images.mjs   Resize + strip metadata from source photos → assets/photos/
tools/build-cv-pdf.mjs      Render cv.html / cv-de.html → assets/cv/*.pdf via Chromium
```

## Local development

No build step — just serve the directory and open it:

```
python3 -m http.server 8000
```

## Regenerating assets

Both tools need `sharp` / `playwright-core`, which are **not** committed (dev-only,
`node_modules/` is gitignored):

```
npm install sharp playwright-core

node tools/optimize-images.mjs
CHROMIUM_PATH=/path/to/chrome node tools/build-cv-pdf.mjs
```

## Content status

See `CONTENT-TODO.md` for the open items — mainly which 42 Heilbronn projects are finished
(with repo links) and a few numbers that would strengthen the experience section.
