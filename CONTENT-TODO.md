# Content still needed from Ursila

Nothing below blocks the site from being live and usable — everything already on the site is
either a verified fact from your existing CVs/documents or a plainly factual date range. This
list is every place I deliberately left a gap rather than guess, ranked by how much it would
strengthen the site.

## 1. Which 42 Heilbronn projects are actually done (highest impact)

`projects.html` lists the standard 42 common-core curriculum (libft, ft_printf, push_swap,
minishell, philosophers, cub3D, etc.), but **every card is marked "To confirm"** — none are
claimed as completed, because I don't know which you've actually finished. This is the single
biggest content gap on the site: it's your strongest, most current proof of engineering
ability, and right now it's a list of exercise descriptions with no results attached.

To fix: tell me (or edit `projects.html` directly — each card is `data-status="unconfirmed"`)
which projects are done, and I'll:
- Switch the badge to "Done" (reuse `.status-badge.status-done`, same style as the two real
  projects above it)
- Add a link to the actual GitHub repo for each
- Add your grade/score or peer-evaluation result if you want it shown

## 2. Numbers

Not one bullet on the original CVs carried a metric — no client count, no dataset size, no
"reduced X by Y%." I didn't invent any. If you can recall even rough figures for these, they'd
upgrade the Experience and Projects sections a lot:

- **Freelancing (2021–2025):** how many clients? Largest dataset (rows/tables/GB)? What did a
  dashboard replace, and how long did that manual process take before?
- **Operations Manager (2019–2020):** how many people in the operation? What did the
  Excel/DB tracking system measure, and what improved — stockouts, reporting lag, error rate?
- **42 Heilbronn:** how many projects finished so far? Any peer-evaluation percentile?
- **ATM project:** team size (solo or paired)? Was it graded?
- **Management Trainee:** what KPIs, over what sales volume?

## 3. Availability date

`profile.md` marks this `<TO FILL>`, so it's omitted from the site entirely rather than
guessed — there's no "available immediately" or similar anywhere. If you want it shown (e.g.
in the hero's availability bar and on the CV), give me a date or a phrase like "by arrangement."
Same applies to remote/hybrid/on-site preference, notice period, and driving licence, if you
want any of those stated.

## 4. Naming freelance clients / the family business

Both are currently described generically ("small businesses," "family business, India") —
matching your original CVs, which also didn't name them. If you're fine naming them, tell me
and I'll add it to `experience.html`, `index.html`, and the CV.

## 5. Judgment calls I made — flag if you'd prefer otherwise

- **German level:** both your original CVs state an unqualified "B2," but the only certificate
  on file is telc **B1** (Nov 2021). I wrote "telc B1 (2021); B2 self-assessed" everywhere
  (site + both CVs). This is more defensible in an interview than an uncertified B2 sitting
  next to a B1 scan.
- **English level:** the German CV claimed C2 with no certificate; I wrote "fluent" instead.
- **CV address:** I put city + postal code (Waiblingen, 71336) on the CV, not the full street
  address — the CV is downloadable by anyone who visits the site, so it's more exposed than a
  CV you'd email directly to one recruiter. Add the street address back in `cv.html`/`cv-de.html`
  if you'd rather keep the traditional full-address German CV format.
- **Phone number:** included on the CV PDF, deliberately left off the public web pages (spam
  harvesting risk). Say the word if you want it on the Contact page too.
- **Google Data Studio → Looker Studio:** it was renamed in 2022; I used the current name with
  "(formerly Google Data Studio)" alongside it everywhere it appears.
- **Contact form:** I did not add a `<form>` on the Contact page. This is a static site with no
  backend, so a real form would need a third-party service (Formspree, Netlify Forms, etc.) —
  wiring one up means creating an account with that service. I left email/LinkedIn/GitHub as
  the contact paths instead of shipping a form that goes nowhere. Say the word if you'd like me
  to set one up.

## 6. Domain / hosting

I couldn't find a GitHub Pages workflow, `CNAME`, or any deployment config in the repo, so I
don't know if Pages is actually turned on. All canonical URLs, the sitemap, and the OG image
currently point at `https://ursilasuraj.github.io/Portfolio/` (the default Pages URL for this
repo). If you enable Pages under **Settings → Pages** and it works, no more mine to do — but
if you get a custom domain (e.g. `ursilapradeep.dev`), tell me and I'll do a global find/replace
across every canonical/OG tag, the sitemap, and `robots.txt`.
