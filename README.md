# Portfolio — Youssef Anbar

A quiet, personal single-page portfolio. Hand-authored HTML, CSS, and JavaScript.
No framework, no build step, no dependencies, no template.

```
portfolio/
├── index.html              structure and the written copy
└── assets/
    ├── css/style.css       design system, both themes, all styling
    └── js/
        ├── data.js         the content — work, groups, byte map, timeline
        └── app.js          theme, copper routing, entries, interaction
```

## Run it

```bash
python -m http.server 4321 --directory portfolio
```

Open <http://localhost:4321>. Any static server works — there is nothing to compile.

## Deploy

Static, so anything will host it:

```bash
npx vercel deploy --prod
```

Project root `portfolio/`, framework preset "Other", no build command. GitHub Pages works equally
well — push `portfolio/` and enable Pages on the branch root.

## Structure

A conventional, scannable résumé shape — hero, about, skills, experience, projects, detail, contact —
so a recruiter can find what they need in fifteen seconds.

**Honest grouping over flattering grouping.** Projects sit in five groups that say what things
actually are: hardware and firmware first because that is the point; then the software that serves
it; then work under NDA, described rather than linked; then the side projects that exist to practise
shipping and positioning, labelled as exactly that; then the foundations. Nothing is dressed up as
more than it is.

**Warm rather than corporate.** Copper on paper — copper because it is the only material here that
was ever ordered by the square inch. Fraunces for display, Source Serif 4 for reading, IBM Plex Mono
for anything numeric. Light and dark themes, both designed rather than inverted, with the choice
persisted and the system preference respected on first visit.

**The cursor routes copper.** The background canvas grows traces toward the pointer the way a board
is actually routed: one orthogonal run, then a 45° break, with a via at every direction change.
Segments oxidise away after a few seconds. Fine pointers only, and disabled under reduced-motion.

**The header retracts as you read** and returns the moment you scroll up, because on a phone it is
worth about 14% of the viewport. It also un-retracts if a keyboard user tabs into it.

## Accessibility

Verified in-browser, not assumed:

- Contrast measured on 17 real text/background pairs across **both** themes — zero failures, weakest
  is 4.77:1, body text 7.28:1 (light) and 9.08:1 (dark)
- All interactive targets ≥ 44 px tall
- Sequential heading order, one `<h1>`, skip link, `lang` set
- No horizontal scroll at 375 px or 1440 px; body text 17 px so iOS never auto-zooms
- On small screens the nav drops to its own scrollable row rather than disappearing — a 16,000 px
  page with no navigation is not a minimal design, it is a broken one
- Theme is set before first paint, so there is no flash of the wrong theme
- `prefers-reduced-motion` disables the routing canvas, the reveals, and the header transition
- Reveal styling is scoped to `.js` with a 2.5 s safety net, so a blocked script or a throttled tab
  can never leave content stuck at `opacity: 0`
- Print stylesheet drops the chrome and avoids breaking cards mid-page

## Before you deploy

- **The LinkedIn URL in `index.html` is unverified.** It is the custom URL recommended in
  `LINKEDIN-PACK.md`, not a profile confirmed to exist. Claim it on LinkedIn or change the `href`.
  There is a `TODO` comment on the line.

## Editing

- **`index.html`** — hero, about copy, section headings, contact. Edit directly.
- **`assets/js/data.js`** — `SKILLS`, `EXPERIENCE`, `EDUCATION`, `GROUPS`, `PROJECTS`, `BYTES`.

To add a project, append an object to `PROJECTS` and set `g` to one of the group ids in `GROUPS`
(`hardware`, `systems`, `nda`, `craft`, `roots`). A link with a third element of `'private'` renders
as a padlock instead of a hyperlink — nine of the eleven repositories are private, and a 404 reads
worse than an honest lock.
