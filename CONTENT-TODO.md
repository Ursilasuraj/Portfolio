# Content still needed from Ursila

Nothing below blocks the site from being live and usable — everything already on the site is
either a verified fact from your existing CVs/documents or a plainly factual date range. This
list is every place I deliberately left a gap rather than guess, ranked by how much it would
strengthen the site.

## 1. 42 Heilbronn projects

**Updated 2026-08-10.** You confirmed 9 of 16 done, and `projects.html` now shows *only* those
9 (plus the 2 real pre-42 projects) — the unconfirmed ones are no longer displayed at all, per
your request, so nothing incomplete is shown publicly.

### 1a. Repo links — please check these

I matched your GitHub account (github.com/Ursilasuraj, 18 public repos) against the 9 by name
and added links for the 6 I was confident about. Please double-check these, especially the two
with a name mismatch:

| Project | Repo linked | Note |
|---|---|---|
| libft | `42_LIBFT` | |
| ft_printf | `42_ft_printf` | |
| push_swap | `push_swap` | exact match |
| minishell | `minishell` | exact match |
| so_long | `so_long_` | trailing underscore in the actual repo name |
| pipex | `pipex_no_bonus` | **name suggests the bonus part isn't included** — let me know if that's right, or if there's a different repo for the full version |

**No matching public repo found** for these 3 — not linked on the site:
- get_next_line
- born2beroot
- minitalk

These might be private repos (common for 42 students), under a different name, or just not
pushed to GitHub. Send me the URLs if they exist and I'll add them.

**Also worth asking:** your GitHub has a repo called `philosopher` (singular) and seven repos
named `CPP_00` through `cpp_06`. Neither `philosophers` nor `CPP Modules` are in your confirmed
list, so I have *not* marked them done or added them anywhere — I'm flagging this only because
their existence might mean you've actually finished (or made real progress on) those too. Tell
me if you want either added.

Also still open for every "Done" card: a link to the actual GitHub repo. I don't have your
repo URLs — send them (or the naming pattern you use) and I'll add a link per card.
- Add your grade/score or peer-evaluation result if you want it shown

## 2. Numbers — ANSWERED 2026-08-19 ✅

These were supplied and are now live on the site:

- **2021–2025:** datasets up to **2 GB**; dashboard turnaround **3–5 days → 2–3 hours** once
  the cleaning pipelines existed; **~30 hrs/week**. No client count, because there were no
  clients — see §4 below.
- **Operations Manager:** **25–30 workers**; the tracking system measured attendance,
  per-worker daily yield and daily raw-latex volume, aggregated monthly for sales. No
  before/after metric exists, so none is stated.
- **42 Heilbronn:** **level 4**, twelve completed projects through the CPP modules. No
  peer-evaluation percentile on record.
- **ATM project:** **team of 4**, graded **10/10**.
- **Management Trainee:** **8 customer accounts**, real-estate market trends.
- **MBA study:** **250 survey responses across 5 outlets**.

Still missing: nothing here. The one open content question is StartSteps — see §6.

## 3. Availability date — ANSWERED 2026-08-19 ✅

All eight standing answers are now filled in `profile.md` §13 and may be stated on the site:

- Earliest start: **September 2026** · Notice period: **none** · **Full-time**
- Salary expectation: **ca. €50,000 p.a.** (±20%)
- Driving licence: **class B since 2023, own car**
- Relocation: **within 200 km of Waiblingen** · Remote / hybrid / on-site: **no preference**

Not all of these belong on a public page — salary in particular. Currently the site states
none of them; say which you want shown.

## 4. Naming the 2021–2025 period and the family business — RESOLVED 2026-08-19 ✅

**The freelance role was removed from the site.** There were no clients and no engagements —
it was self-directed study and personal projects, added to the original CV to fill a gap in
the timeline. Describing it as consulting "for small businesses" was a claim that could not
survive an interview question, and it was public under her name. It is now stated as
*Self-directed study — data analysis & software development*, with the real substance named.

The family business is now named for what it is: a **rubber estate in Kerala** running tapping
crews, collection, barrel storage, preservation, sheet processing and sale, with 25–30 workers.

See `profile.md` DQ-16 and DQ-18 in the Apps repo for the full record.

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

---

## 6. The one open content question

**StartSteps (2022).** It was removed from every certification list on the site and from both
CVs, because its content is not documented anywhere and cannot be described if an interviewer
asks. It reads as an AI credential purely because of the name — it is not one. One sentence
about what it actually covered (topic, duration, format) puts it back on the page.
