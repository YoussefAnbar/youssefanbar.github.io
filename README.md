# youssefanbar.github.io

My portfolio. Hand-written HTML, CSS, and JavaScript — no framework, no bundler, no build step, no template. Served by GitHub Pages as a user site straight from the repository root, so what is in `main` is what is live.

Live at **https://youssefanbar.github.io**

## Why it is built this way

A portfolio that claims I can work close to the metal should not need a toolchain to render a list of projects. Everything here is three files a browser can read directly. If you view source, you see the site — there is no compiled bundle in between.

The cost of that choice is real and worth naming: no component reuse, no type checking, and content lives in a JavaScript array rather than a CMS. For a single-page site that one person edits, that trade is fine. It would not be at ten pages.

## Layout

```
index.html              the whole document — every section, in order
assets/
  css/style.css         all styling, including both themes and the print sheet
  js/data.js            all content: projects, skills, experience, education, the frame spec
  js/app.js             all behaviour: rendering, theming, filtering, canvas, reveal
  img/portrait.jpg      the About photo, 760x1643
  img/portrait.webp     same image, ~1/3 the bytes, served first via <picture>
```

Four source files. `data.js` and `app.js` are deliberately separate so that editing content never means touching logic.

`data.js` is plain declarative data — `PROJECTS`, `GROUPS`, `SKILLS`, `EXPERIENCE`, `EDUCATION`, `INTERESTS`, `BYTES`. `app.js` reads it and renders. To add a project, add an object to `PROJECTS`; nothing else changes.

## Design system

Four accent hues, one per discipline, used as an index rather than as decoration. The same colour means the same thing everywhere on the page.

| Variable | Meaning | Value |
|---|---|---|
| `--c1` | hardware | `#01798F` |
| `--c2` | firmware / flight | `#6134D4` |
| `--c3` | sensing | `#C4136A` |
| `--c4` | software | `#965D00` |

Background is `#FAFAFC`, surfaces are white. **Light only** — the previous dark variant was dropped. A single theme means one set of colours to get right rather than two, and every accent above is tuned to clear AA on white as text *and* as a fill behind white text.

`--c1` started at `#0286A6` and measured 4.23:1, which failed. It is `#01798F` because that clears 5.08:1. The obvious teal was not dark enough.

Type is Space Grotesk for display and body, IBM Plex Mono for code and labels.

### Contrast

Measured in-browser across 33 text/background pairs with alpha composited through the parent chain — not eyeballed, and not computed from the tokens alone. Zero failures. Weakest pair is 5.08:1 against a 4.5:1 requirement.

## Accessibility

- `prefers-reduced-motion` is honoured in both CSS and JS. The cursor canvas, card tilt, count-ups, aurora drift, marquee and reveal stagger are all skipped rather than shortened.
- Interactive targets are at least 44px.
- The skill badges carry `aria-pressed`; the filter bar and the byte reader are `aria-live`.
- Focus-visible outlines are styled rather than removed.
- A print stylesheet exists, because the most likely reason someone prints this is a recruiter who wants it on paper.
- The reveal animation has a 2.5 second safety timeout in `app.js`, so a failure of `IntersectionObserver` can never leave content permanently hidden.
- `<noscript>` points at `assets/js/data.js`, which reads fine as plain text.

## Editing

GitHub Pages caches assets for roughly ten minutes. The `?v=` query on the three asset references in `index.html` is a cache buster — **bump it every time you edit the CSS or JS**, or the change will not reach anyone holding a cached copy:

```html
<link rel="stylesheet" href="assets/css/style.css?v=8">
<script src="assets/js/data.js?v=8"></script>
<script src="assets/js/app.js?v=8"></script>
```

All three should always carry the same number — and it must only ever go **up**. Two separate edits both landing on `?v=6` once left browsers serving the older of the two files, because the URL never changed. A collision is worse than no cache buster at all, since it looks like it worked.

## History

Six commits, all on 13 August 2026:

1. `Portfolio site` — the first working version
2. `Restructure: centred layout, pill headers, alternating timeline, project card grid`
3. `Resistor-code skill badges with skill-to-project cross-filter`
4. `Fix badge matching: word boundaries, STM32C011 term, encoder in stack` — naive substring matching had "CAN" hitting "cannot" and "C" hitting everything; replaced with word-boundary regexes that treat `+ # / .` as part of a token so `C/C++` and `ROS 2` behave
5. `Add asset cache-busting so updates go live immediately`
6. `Rebrand: High Voltage — plasma spectrum, one hue per discipline, aurora field, marquee, card tilt` — replaced a copper-on-paper palette with the current one

## The portrait

The source shot is 853x1844 — roughly 2.16:1. That aspect is why the About section is two columns above 880px rather than a centred stack: a portrait that tall stacked above the text pushes everything below the fold.

It is shown whole. `.portrait img` is `width:100%; height:auto` with no `object-fit`, so nothing is ever cropped — the frame takes the shape of the photo instead of the photo being cut to fit the frame.

It is served as WebP with a JPEG fallback through `<picture>`: 1.5 MB PNG in, 37 KB WebP out.

## Content sources

`data.js` merges two sources: the repositories (commit counts, test floors, protocol constants) and the current résumé (roles, metrics, awards). Anything not in a repo — Texas Spacecraft Laboratory, the three hackathon builds, the GE Vernova figures — comes from the résumé and is marked as having no public repository rather than linked to a 404.

The three hackathon projects have no repositories at all. They were designed, built and demoed inside a weekend; if the code exists anywhere it is not on this account.

## Outstanding

- The LinkedIn href in `index.html` is marked `TODO` and has not been verified as claimed.
- The phone number in the contact section is public and will be scraped. Remove it if that matters.
- Nine of the linked repositories are private, so per-project READMEs describing what each build
  taught will not be publicly readable until those repos are opened.
