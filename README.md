# Portfolio

A personal portfolio website for Ursila Pradeep Vadakkumpuram — software
developer and data consultant. Hand-written HTML and CSS with a small amount of
JavaScript; no build step, no framework, no dependencies to install.

## Pages

| File | Contents |
| --- | --- |
| `index.html` | Landing page and introduction |
| `education.html` | Academic background |
| `experience.html` | Work history |
| `skills.html` | Technical and language skills |
| `contact.html` | Contact details and links |

## Themes

`theme.js` drives a three-way theme switcher in the navigation bar — **Dark**
(the default), **Pastel Green** and **Light Blue**. The choice is applied by
setting `data-theme` on `<body>` and remembered in `localStorage` under
`portfolio-theme`, so it survives a reload and carries across pages.
`styles.css` defines the base palette on `body` and overrides it in
`body[data-theme='pastel']` and `body[data-theme='light-blue']` — adding a
fourth theme means adding one more block and one more button.

## Running it locally

There is nothing to build. Open `index.html` in a browser, or serve the folder
if you would rather have real URLs:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Layout

```
index.html, education.html, experience.html, skills.html, contact.html
styles.css      all styling, including the theme palettes
theme.js        theme switching
assets/         brand-mark.svg, profile-portrait.svg
images/         photographs used across the pages
```

Typography comes from Google Fonts (Inter), loaded over the network, so the
pages look slightly different offline.
