# Application pack — Bosch Junior Managers Program (Supply Chain Management)

Target role: Junior Managers Program (Trainee), Supply Chain Management —
Robert Bosch GmbH, Robert-Bosch-Platz 1, Gerlingen-Schillerhöhe.

| File | Purpose |
| --- | --- |
| `bosch-junior-managers-cv.html` | CV source. A4, two pages. |
| `Ursila_Pradeep_Vadakkumpuram_CV_Bosch_JMP.pdf` | Rendered CV. |
| `bosch-junior-managers-cover-letter.html` | Cover letter source. A4, one page. |
| `Ursila_Pradeep_Vadakkumpuram_Cover_Letter_Bosch_JMP.pdf` | Rendered letter. |
| `profile-photo.jpg` | Header photo, cropped to the 35×45 mm German CV ratio. |

## Where the content came from

Every factual claim — dates, degrees, job titles, project scope, tools,
certifications — is taken from the portfolio pages in this repository
(`index.html`, `education.html`, `experience.html`, `skills.html`).

**Nothing was invented.** No figures, percentages, team sizes, client counts,
grades or employer names have been supplied, because none of them appear in
the portfolio. Every unverified item is a highlighted `[ ... ]` slot.

The cover letter is the one exception worth naming: its argument — why this
programme, why the move to 42 Heilbronn — is drafted language, not sourced
fact. Read it as a proposal for how to frame your case and rewrite anything
that does not match your actual reasons. It has to sound like you.

## Regenerating the PDFs

```sh
for f in cv cover-letter; do
  chromium --headless --no-pdf-header-footer \
    --print-to-pdf="$f.pdf" "bosch-junior-managers-$f.html"
done
```

Once every `[ ... ]` slot is resolved, change `<body>` to `<body class="final">`
in both files. The yellow highlighting disappears and the text prints as
normal copy. Re-check that the letter is still one page after editing.

## Must be filled before sending

Bosch is a tier-1 employer and this programme is heavily oversubscribed. A CV
with unnamed employers or universities will not survive the first screen.

**Blocking — the advert names these as requirements:**

1. **International experience, minimum three months.** You said one of your
   roles was based abroad. Name which one, the country, and the total time
   there, in both the CV section and the role's own location line. State the
   duration explicitly — do not make a screener count months from dates.
2. **German — CEFR level.** The advert asks for "good German skills".
3. **English — CEFR level.** The advert asks for negotiation level (C1+).
4. **Master's grade.** The advert asks for an *outstanding* Master's. Without
   a grade the strongest word in the requirement goes unanswered. Give the
   grade and the scale (e.g. "1.4, German scale" or "3.8/4.0").

**Blocking — credibility:**

5. **University names and locations** for the MBA and the B.E.
6. **Employer names and locations** for the Operations Manager and Management
   Trainee roles. Unnamed employers read as unverifiable.
7. **Certification years.** The portfolio gives 2022–2023 as a block; each
   certificate needs its own year.
8. **Contact block** — address, phone, email, LinkedIn, plus nationality and
   work authorisation for Germany. German recruiters expect the last two, and
   stating them removes an early objection if you need a visa.
9. **Confirm you are still at 42 Heilbronn.** The CV says "Present" on the
   strength of the portfolio. If you have finished or paused, give the end date.

**Strongly recommended — this separates a shortlist from a rejection:**

10. **Numbers on the Operations Manager role.** This is your leadership
    evidence, and the advert asks explicitly about human-centric leadership.
    Team size, sites, volumes, and one measurable improvement (on-time
    delivery, error rate, throughput, cost).
11. **Numbers on the freelance consulting.** Client count, sectors, and one
    outcome a client actually got.
12. **Master's thesis title.** If the Retail & E-Commerce project (Jan–May
    2018) was your thesis, say so — it lands directly on supply chain and
    data, exactly the target. It currently sits under Projects unlabelled
    because that link is not stated anywhere in the portfolio.

## Writing the four cover-letter slots

These are the paragraphs that decide the application, so they are worth more
time than the rest of the pack combined.

- **The concrete result** (paragraph 2). One sentence, with a number in it, or
  a decision that changed because of your reporting. Not "improved
  efficiency" — *what* moved, from what, to what, over what period. If you
  genuinely have no number, describe a specific decision instead: which one,
  who made it, what the data showed.
- **International experience** (paragraph 4). Role, country, duration. Keep it
  factual; the letter is not the place to argue that it counts.
- **Why Bosch** (paragraph 5). Name something concrete — a Bosch supply chain
  or logistics initiative, a division you want to rotate through, a product
  area you care about. Recruiters read generic praise as a form letter, and
  this is where most applications are lost. Twenty minutes on Bosch's supply
  chain and sustainability reporting will give you something real to point at.
- **Sustainability** (paragraph 5). The advert names it alongside
  digitalisation and automation, and it is the one theme you have no evidence
  for. If you have something genuine — a project, a course, a decision you
  influenced — add it. If not, leave it out and let the digitalisation and
  automation evidence carry the paragraph. A claim you cannot defend at
  interview costs more than a gap.

## Recruiter assessment

**Reads strongly against the advert:**

- MBA in Supply Chain Management is a direct hit on both the degree
  requirement and the domain.
- The data profile is genuinely good. SQL, data modelling, Tableau, Power BI
  and the Google Data Analytics certificate answer "data, processes and
  systems are a challenge" with evidence rather than adjectives.
- Operations Manager plus Management Trainee means you have already been
  through a rotation programme and then run operations. Few applicants to a
  graduate programme have that.
- 42 Heilbronn is a real differentiator for the digitalisation and automation
  angle. Most SCM applicants cannot read or write code.

**Risks to go in prepared for:**

- **Programme fit versus your seniority.** This is a graduate-entry track.
  Your Master's completed in 2018 and you have close to seven years of
  experience since. Graduate programmes commonly cap how long ago the degree
  was awarded or how much post-graduation experience is allowed. I could not
  verify Bosch's specific rule, so check the eligibility criteria on the Bosch
  careers page before investing in the application. If there is no hard cap,
  the cover letter still has to explain the choice, or a screener will read it
  as a step backwards.
- **The 42 Heilbronn pivot needs a story.** Moving from supply chain
  operations into C programming looks like a career change unless it is framed
  as deliberate. Paragraph 3 of the letter takes that on directly — check that
  the reasoning it gives is actually yours.
- **Sustainability is unevidenced.** See above.
- **Two-page CV, page two runs short.** It balances once the fill-ins are in.
  If it still looks thin afterwards, that is a signal you are under-selling
  the two experience roles, not a formatting problem.

## Format notes

- The photo is cropped from `images/Profile_pic.jpg` to 35×45 mm, the German
  CV convention. A photo is optional and not legally required — say if you
  would rather drop it, and remove the `<img class="photo">` line.
- Both PDFs carry real selectable text in a single-column layout, so applicant
  tracking systems will parse them.
- Neither file loads webfonts or any other network resource, so the PDFs
  render identically offline.
- If your German is B2 or above, a German-language version will help. Ask and
  I will produce one.
