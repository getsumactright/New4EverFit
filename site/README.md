# 4Ever Fit Lifestyle — marketing site

Astro + Tailwind. Structure, copy and the assessment-quiz/drawer engineering carry forward from the
original design handoff (`../4EverFit Landing.dc.html` / `../4EverFit Mobile.dc.html`), but the **visual
system was fully redesigned** around the client's actual badge logo — see `../PRODUCT.md` and
`../DESIGN.md` at the project root for the full rationale, palette, and type system ("Cast Bronze").
The original flat, zero-radius "Counted Weight" system documented lower in git history was built around a
different, since-abandoned logo direction and no longer applies.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Deployment

Hosted on **Netlify**, built from `main` on every push. Config is in
`../netlify.toml` — base `site`, command `npm run build`, publish `dist`, Node 22.
Connecting the repo in the Netlify UI needs no further setup; branch pushes and
pull requests get their own deploy previews automatically.

**The site deploys at the root of its domain, so there is no `base` path.** This
replaced a GitHub Pages setup (`base: '/4EverFit/'`, deployed by
`.github/workflows/deploy.yml`, both now removed). That base had to be hardcoded
into `src/styles/fonts.css` and the sheen `mask-image`, because plain CSS cannot
read `import.meta.env.BASE_URL` — so the CSS and the config could drift apart and
silently 404 every font, which is exactly what happened once. Root-relative paths
remove that whole class of bug, and `npm run dev` now serves at `localhost:4321`
rather than `localhost:4321/4EverFit/`.

`${base}` interpolation is still used in the markup (`Layout.astro`, `Logo.astro`,
`index.astro`). It resolves to `/` now and costs nothing, so it stays — if the site
ever moves back under a sub-path, only `astro.config.mjs` needs to change.

## What's implemented

- **Graphite design system** (v3, 2026-08-23) in `src/styles/global.css` — near-zero-chroma light ground
  (`--color-bg: #F4F4F3`), white cards separated by a structural `--color-line` hairline rather than by
  value, and a deep graphite accent (`#2A2E31`) cleared for text at any size. Mapped into Tailwind via
  `@theme inline`. Replaces v2 "Cast Bronze" (warm cream + brass), whose accent measured 3.26:1 and failed
  AA for the small numerals it carried. A rendered audit of the live page across 117 text elements returns
  zero AA failures. The cast-bronze badge is now the only colour on the page. See `../DESIGN.md`.
  Token names were rewritten in the same pass — `brass*`/`cream*`/`paper*`/`divider*` are gone, replaced by
  `accent`/`accent-hover`/`accent-soft`/`on-accent`/`ink`/`muted`/`surface`/`surface-muted`/`line`. The old
  names actively misled: `--color-cream` was aliased to ink and `--color-brass-bright` was *darker* than
  `--color-brass`.
- The client's actual badge logo (`public/logo/4everfit-badge.png`) via `src/components/Logo.astro` — a
  small icon next to a Fraunces wordmark at nav/footer sizes, full-size with a one-time bronze sheen sweep
  in the hero.
- Three AI-generated mood photographs (`public/img/*.jpg`, via Higgsfield) standing in for hero, "how a
  session runs," and coach imagery — matched to the Cast Bronze palette so the page reads as intended
  before real photography exists. **Replace with real photography before launch**, same as the
  results/testimonial picsum.photos placeholders.
- One responsive page (`src/pages/index.astro`) containing **two** parallel layout trees — a desktop tree
  (`hidden sm:block`) and a dedicated mobile tree (`sm:hidden`), same architecture as the original build.
- The assessment quiz (`src/scripts/assessment.ts`) — unchanged logic, restyled. Its **confirmation state
  now hands off to the app** instead of promising a follow-up email: "get the app to see your plan," with
  App Store / Google Play badge links (currently `href="#"` placeholders — wire up real store links before
  launch). This reflects the updated purpose in `../PRODUCT.md`: the assessment is the on-ramp to the app,
  not a stand-alone lead-gen form.
- Mobile drawer nav (`src/scripts/drawer.ts`) — unchanged, focus trap/Esc/scroll-lock all still wired.
- Reveal-on-scroll (inline script at the bottom of `index.astro`) — staggered per section/card, enhances an
  already-visible default (content isn't hidden if JS fails or `prefers-reduced-motion` is set), fully
  reduced-motion safe.

## Known gaps before this ships

- **AI-generated placeholder photography** (hero/session/coach) and **picsum.photos placeholder
  photography** (results) — both need replacing with real client photography before launch, along with all
  placeholder body copy, credentials, client names/results, and FAQ answers.
- **The submit handler POSTs to `/api/assessment`, which doesn't exist yet** — no backend in this static
  build; the fetch failure is swallowed so the confirmation state still shows. Wire up a real endpoint (or
  CRM/ESP) before launch.
- **App Store / Google Play links are `href="#"` placeholders** in the assessment's confirmation state —
  point them at the real app listings once published.
- ~~`DESIGN.md`'s palette values are stale~~ — **resolved 2026-08-23.** The whole system was replaced
  with v3 "Graphite" and `DESIGN.md` now documents what actually ships.

## Fixed since the last handoff

- **Typeface change, 2026-08-23: Bebas Neue + Poppins**, replacing Fraunces + Inter. Self-hosted the
  same way — latin/latin-ext subsets in `src/styles/fonts.css` and `public/fonts/`, from
  `@fontsource/bebas-neue` and `@fontsource/poppins`, no Google Fonts CDN request. Ten woff2 files, 96KB
  total (down from the variable Fraunces). Bebas is **caps-only, one weight, no italic** — see
  `../DESIGN.md` → Typography for the constraints that imposes and the record of why caps was chosen
  despite `PRODUCT.md`'s anti-reference. Fixed along the way: `Layout.astro` was preloading two font
  files that no longer exist, and the desktop hero H1 had no space between "camera." and "No guesswork."
  because the text and its `<em>` sat on separate source lines and Astro collapsed the newline to nothing
  (the mobile tree already had them on one line and was fine).
- **Fixed a real navigation dead zone**: the header's full nav links only appear at `min-[900px]`, and the
  dedicated mobile tree (with its own drawer) is `sm:hidden` (i.e. gone at ≥640px) — so any viewport from
  640–899px (common tablet/small-laptop widths) had no way to reach Pillars/How it works/Coach/Results: no
  visible links, no hamburger. Added a second hamburger + drawer scoped to the desktop tree for that range
  (`src/pages/index.astro`, `#tablet-drawer`), and generalized `src/scripts/drawer.ts` to drive multiple
  independent trigger/drawer pairs via `aria-controls`/`id` matching instead of a single
  `querySelector`. Also fixed the header's CTA button hugging the logo instead of sitting at the right edge
  in that same width range (the nav's `ml-auto` did nothing once the nav itself was `display:none`).
