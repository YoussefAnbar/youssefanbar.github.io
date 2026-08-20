# youssefanbar.github.io

My portfolio. Hand-written HTML, CSS, and JavaScript — no framework, no bundler, no build step, no template. GitHub Pages serves it as a user site straight from the repository root, so whatever is on `main` is what is live.

Live at **https://youssefanbar.github.io**

## Why it is built this way

A portfolio that claims I can work close to the metal should not need a toolchain to render a list of projects. Everything here is text a browser reads directly — view source and you are looking at the site, not at a compiled bundle.

The cost is real and worth naming: no component reuse, no type checking, and content lives in a JavaScript array rather than a CMS. For a two-page site that one person edits, that trade is fine. It would not be at ten pages.

## Layout

```
index.html               the portfolio — every section, in order
project.html             per-project write-up, addressed as project.html?p=<slug>
assets/
  css/style.css          all styling, including the print sheet
  js/data.js             content: PROJECTS, GROUPS, SKILLS, EXPERIENCE,
                         EDUCATION, INTERESTS, AWARDS, BYTES, HUE
  js/stories.js          content: long-form write-ups, keyed by project slug
  js/app.js              behaviour for index.html
  js/project.js          behaviour for project.html
  js/menu.js             the navbar utility menu, shared by both pages
  img/portrait.jpg       the About photo, 760x1643
  img/portrait.webp      the same image at ~1/3 the bytes, served first via <picture>
```

The split is deliberate. `data.js` and `stories.js` are declarative content — plain arrays and objects, no logic. `app.js`, `project.js`, and `menu.js` are behaviour: they read that content and render it. Editing content never means touching logic.

To add a project, add an object to `PROJECTS` in `data.js`; nothing else changes. Give it a `slug` and a matching `STORIES` entry with `status: 'ready'` and the card also gains a "Read the process" link to its own page. A `STORIES` entry marked `draft` renders an honest placeholder rather than an empty page.

## Design system

**One light theme.** There is no dark variant and no theme toggle. `:root` declares `color-scheme: light` and a single set of tokens. One palette to get right rather than two.

Four accent hues, one per discipline, used as an index rather than as decoration. The same colour means the same thing everywhere on the page.

| Variable | Meaning | Value |
|---|---|---|
| `--c1` | hardware | `#01798F` |
| `--c2` | firmware / flight | `#6134D4` |
| `--c3` | sensing | `#C4136A` |
| `--c4` | software | `#965D00` |

Background is `--bg: #FAFAFC`; surfaces are white. Text is `--fg: #0F1424`, with `--fg2: #454D66` for body copy and `--fg3: #5C6480` for captions and metadata.

Type is Space Grotesk for display and body, IBM Plex Mono for code and labels.

### Contrast

WCAG 2.1 ratios computed from the `:root` values above — linearise each channel, `L = 0.2126R + 0.7152G + 0.0722B`, `(Lmax + 0.05) / (Lmin + 0.05)`.

The second column is the token as text on the page background. The third is white text on the token used as a fill, which is how `.button`, `.badge.on`, and `.bt.on` render it — every accent has to clear AA in both directions.

| Token | Value | On `--bg` `#FAFAFC` | White on it |
|---|---|---|---|
| `--fg` | `#0F1424` | 17.58:1 | 18.33:1 |
| `--fg2` | `#454D66` | 8.04:1 | 8.38:1 |
| `--fg3` | `#5C6480` | 5.61:1 | 5.85:1 |
| `--c1` | `#01798F` | 4.87:1 | 5.08:1 |
| `--c2` | `#6134D4` | 6.83:1 | 7.12:1 |
| `--c3` | `#C4136A` | 5.52:1 | 5.76:1 |
| `--c4` | `#965D00` | 5.22:1 | 5.44:1 |

Weakest pair is `--c1` at 4.87:1 against a 4.5:1 AA requirement for normal text. The obvious teal was not dark enough; this one is.

These are token-against-token figures. They do not account for the alpha-composited surfaces (`--line`, `--line2`, the `color-mix` borders), which are decorative rather than text.

## Accessibility

- `prefers-reduced-motion` is honoured in both CSS and JS. In `app.js` a single `REDUCED` flag gates the cursor-trace canvas, the prize count-ups, the card tilt, the reveal stagger, and smooth scroll targets; in CSS the aurora drift, marquee, scroll cue, timeline pulse, and reveal transitions are all inside `@media (prefers-reduced-motion: no-preference)`. Motion is skipped, not shortened.
- Interactive targets are at least 44px.
- The skill badges carry `aria-pressed`, toggled as the cross-filter changes. The project filter bar and the byte reader are `aria-live`; so is the article on `project.html`.
- Focus-visible outlines are styled rather than removed, and the navbar un-hides itself on `focusin` so keyboard focus never lands off-screen.
- A print stylesheet exists, because the most likely reason someone prints this is a recruiter who wants it on paper.
- The reveal animation has a `setTimeout(showAll, 2500)` safety net in `app.js`, so a failure of `IntersectionObserver` can never leave content permanently hidden.
- `<noscript>` points at `assets/js/data.js`, which reads fine as plain text.

## Editing

GitHub Pages caches assets for roughly ten minutes. The `?v=` query on every asset reference is a cache buster — **bump it every time you edit the CSS or JS**, or the change will not reach anyone holding a cached copy.

It is currently `v=20`. Both `index.html` and `project.html` carry five references each — the same stylesheet and the same three shared scripts, except that `project.html` loads `project.js` where `index.html` loads `app.js`:

```html
<link rel="stylesheet" href="assets/css/style.css?v=20">
<script src="assets/js/data.js?v=20"></script>
<script src="assets/js/stories.js?v=20"></script>
<script src="assets/js/app.js?v=20"></script>
<script src="assets/js/menu.js?v=20"></script>
```

All of them must always carry the same number, on both pages — and it must only ever go **up**. Two separate edits both landing on `?v=6` once left browsers serving the older of the two files, because the URL never changed. A collision is worse than no cache buster at all, since it looks like it worked.

## The portrait

The source shot is 853x1844 — roughly 2.16:1. That aspect is why the About section is two columns above 880px rather than a centred stack: a portrait that tall stacked above the text pushes everything below the fold.

It is shown whole. `.portrait img` is `width:100%; height:auto` with no `object-fit`, so nothing is ever cropped — the frame takes the shape of the photo instead of the photo being cut to fit the frame.

It is served as WebP with a JPEG fallback through `<picture>`: 107 KB JPEG, 37 KB WebP.

## Content sources

`data.js` merges two sources: the repositories (commit counts, test floors, protocol constants) and the current résumé (roles, metrics, awards). Anything not in a repo — Texas Spacecraft Laboratory, the three hackathon builds, the GE Vernova figures — comes from the résumé and is marked as having no public repository rather than linked to a 404.

The three hackathon projects have no repositories at all. They were designed, built and demoed inside a weekend; if the code exists anywhere it is not on this account.

## Outstanding

- Eight of the fifteen `STORIES` entries are written and marked `ready`. The remaining seven are `draft` and render a placeholder: `cdh-flight-software`, `tinycore-industries-micro-drone-hat`, `baja-telemetry-ecu`, `chipless-rfid-strain-sensing`, `ultrasonic-smart-bin`, `ai-cross-document-verification`, `design-review-and-benchmarking`.
- The LinkedIn href in `index.html` is marked `TODO` and has not been verified as claimed.
- The phone number in the contact section is public and will be scraped. Remove it if that matters.
- Nine of the linked repositories are private, so per-project READMEs will not be publicly readable until those repos are opened.
