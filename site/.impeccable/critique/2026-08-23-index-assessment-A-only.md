# Critique — site/src/pages/index.astro — 2026-08-23

⚠️ INCOMPLETE RUN. This is Assessment A (design review) only. Assessment B
(deterministic detector + browser evidence) was not run — the user redirected to
palette work mid-run. No synthesis, no combined score persisted through the
storage helper. Re-run `/impeccable critique site/src/pages/index.astro` for a
complete, scored critique.

Assessment A scored the page **16/40 (Poor)** on Nielsen heuristics, dominated by
one root cause: `Button.astro` drops every `data-*` prop (no rest spread), which
kills Back, Start-over, Submit feedback, and the drawer close-on-navigate. Fixing
that one component plausibly recovers ~7 points.

Full Assessment A report follows verbatim.

---

## Heuristic scores (16/40)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 1 | No checked state on answers; submit never shows "Sending…" (`submitBtn` is null); Back renders on Q1. |
| 2 | Match system / real world | 3 | FAQ headed "Before you book." on a page with nothing to book; pillar named 3 ways. |
| 3 | User control and freedom | 0 | Back dead everywhere, Start-over dead, drawer CTA leaves you scroll-locked in the menu. |
| 4 | Consistency and standards | 2 | Mobile tree drops the assessment `<h2>` and all reassurance copy; FAQ default-open differs per tree. |
| 5 | Error prevention | 2 | Auto-advance with no correction path and no guardrail. |
| 6 | Recognition rather than recall | 1 | Email step asks users to commit to 4 answers they can't see and never saw confirmed. |
| 7 | Flexibility and efficiency | 2 | Auto-advance is a real accelerator; no resume, no state persistence across reload. |
| 8 | Aesthetic and minimalist design | 2 | Card-vs-ground 1.10:1; two identical primary CTAs in one mobile viewport; internal notes render live. |
| 9 | Error recovery | 1 | Designed error path unreachable (native validation wins); backend failure shows the SUCCESS screen; error text uses the decorative gold. |
| 10 | Help and documentation | 2 | Good FAQ, but below the ask. No contact, no privacy policy, no coach name. |

## P0 — `Button.astro` swallows every `data-*` attribute

No rest spread in the destructure, so `data-action="back"` (x4), `data-action="start-over"`,
`data-action="submit"` and `data-drawer-link` never reach the DOM. Verified live:
`querySelectorAll('[data-action]').length === 0`. Back is inert on every step of both trees
AND never hidden, so it renders on Q1. Drawer CTA sets the hash but leaves `drawer.hidden`
false and `body.overflow` hidden — user taps the menu's primary CTA and lands in an unchanged
full-screen menu with scroll locked. Auto-advance means one mis-tap is unrecoverable without a
reload that discards all four answers.
**Fix:** add `...rest` to the destructure and spread onto the tag; widen `interface Props`.
Make `assessment.ts` warn loudly when a handle is null.

## P0 — Answer options have no selected state and no visible focus ring

Radios are `sr-only`; the visual marker is `.mark-hollow`, which has **no `:checked` rule
anywhere in the codebase**. Selected marker computes to `background-color: rgba(0,0,0,0)`.
Label has no `:focus-within`, so the only focus indicator is on a 1x1 clipped input — WCAG
2.1 AA 2.4.7 failure on the page's only interactive flow.
**Fix:** `input:checked + .mark-hollow { background/border: var(--color-brass) }`;
`label:has(input:focus-visible) { outline: 2px solid … }`. Add a ~180ms hold before
auto-advance so the fill is perceived.

## P1 — The light flip destroyed figure/ground and inverted the accent tokens

- `--color-bg-raised` vs `--color-bg` = **1.10:1**; `--color-paper` (white) vs bg = **1.21:1**.
  Every container is carried by drop-shadow alone.
- `--color-brass-bright` (#7f5c1e) is **darker** than `--color-brass` (#a3792e). Every element
  chosen for being the brighter one — hero `<em>No guesswork.</em>`, eyebrows, all four stat
  numerals, nav hover, focus ring — now renders as the dimmest.
- `--color-brass` #a3792e = **3.26:1** on the ground, carrying 15px pillar numerals, 20–22px
  accordion glyphs and session-step numerals. Fails AA at those sizes.
- `--color-cream` is aliased to ink; `--color-cream-muted` is identical to `--color-muted`;
  `--color-brass-deep-ondark` is dead.
- Ground #efe9dd sits dead-centre in the warm-neutral band the skill flags as the 2026 AI
  default; token names `--color-cream` / `--color-paper` are themselves on the tell-list.

## P1 — Confirmation state is the emotional low point and never reflects answers back

Ends on a 7px dot, "THANKS, BRIAN.", two homemade store-badge lookalikes and a dead
"Start over". The four answers are already in `this.state.answers` and are never shown.
Peak-end: this is the last thing every converting visitor sees and it's quieter than the FAQ.

## P1 — Internal production notes ship to visitors, and the coach is anonymous

"Placeholder credentials — confirm with client before launch." and "Placeholder photography
and results — replace before launch." both render live. Coach section headed "One coach. Your
whole file." names nobody. Footer is a logo and four words — no contact, no privacy policy,
no copyright. A premium buyer's first move is to search the coach's name; there isn't one.

## Persona red flags (condensed)

- **Casey (mobile):** intro overlay locks scroll up to ~3.4s with a 13px unpadded skip that
  overlaps the sticky bar; two identical brass CTAs in the first viewport; sticky bar persists
  during the quiz; no state persistence across reload; carousels have no dots/arrows/peek.
- **Sam (a11y):** no focus indicator on the radios; no checked state; focus lost on submit
  (`focusHeading()` targets a hidden panel — `activeElement` is BODY after success);
  placeholder text 3.42:1; error colour is the decorative gold.
- **Jordan (first-timer):** mobile assessment card has no heading, no eyebrow, no explanation
  — all of it lives only in the desktop tree; Back on Q1; pillar named three ways.
- **Dana (referred premium buyer):** no coach name, live placeholder disclaimer under the
  credentials, a lion in the results grid, empty footer, no privacy language at the email
  field, `you@work.com` placeholder, and 3 testimonials sharing names with the 3 results
  against a "400+ clients" claim.

## Minor observations

- Bebas at 40–72px is correctly set (0.012em / 1.02–1.08, `text-wrap: balance`, no overflow at
  1280/760/375). Caps at **display** size is working.
- Caps costs real money **below ~18px**: results stats at 12–13px brass caps (the proof text),
  store-badge names at 15px, `<h4>` session titles at 17–18px, five mobile FAQ summaries at 17px.
  Suggested rule preserving the client's choice: **Bebas floor ~18px; below that, Poppins
  500/600 at 0.06em tracking.**
- Typographic inversion in the quiz: question shouts in caps, answers are calm sentence case.
  The relationship should run the other way.
- No scroll-spy/active state in nav. Desktop FAQ opens item 1, mobile opens none.
- At 760px the hero badge hangs half off the photo with a visible disc edge — reads as a sticker.
- Mobile: ~19% of an 812px viewport is permanent chrome (67px header + ~90px bottom bar).
- Both drawers use bg-raised on bg = 1.10:1; the menu reads as the page emptying, not an overlay.
- Malformed emails are caught by native validation first, so the designed error path and its
  `role="alert"` are unreachable code.
- Hero image is `loading="lazy"` but is the LCP candidate. `GrayFigure` hard-codes 900x1200
  regardless of actual aspect.
- Two `<h1>` in the DOM (one per tree) — harmless, but doubles shipped markup.

## Open questions worth answering

1. The brief said "boutique training studio at dusk." Why is the page bright cream? The flip
   kept the tokens and threw away the concept.
2. What on this page could not have been generated from "premium personal training landing
   page"? Currently: the badge PNG and about six lines of option copy.
3. The answer-option copy is the strongest asset on the page. Why is it buried four steps into
   a quiz nobody has started?
4. Should the assessment be a section, or the page? ~5,800px of scroll before the ask.
5. Can any value be delivered before the email ask?
6. Is there a real number this business has, instead of "1:1 / 4 / 45 / 0"?
7. Who is the coach, and why is the page hiding them?
