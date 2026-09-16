# Design

## Name

Graphite

## Summary

Near-zero-chroma light paper with a deep graphite accent, and the cast-bronze badge left as the only
colour on the page. That is PRODUCT.md principle 1 ("the badge earns its keep once, not everywhere")
taken literally: with no accent hue competing, the mark is the single warm object in the frame.

Chosen 2026-08-23. Supersedes v2 "Cast Bronze" (warm cream ground + brass accent), which itself
superseded the original "Counted Weight" system. Two things forced the change: the brass accent measured
**3.26:1** on its ground and failed AA for the small numerals and accordion glyphs it was carrying, and
the cream ground sat at the centre of the warm-neutral band that now reads as generic across the
category.

## Color

Strategy: **Restrained**, deliberately — the accent is near-neutral and the page carries almost no
chroma. This is a departure from v2's Committed strategy and it is a real bet: with no colour doing the
work, the photography, the spacing and the type carry the page. It is the option with the least to hide
behind.

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#F4F4F3` | Page ground |
| `--color-bg-raised` | `#E6E7E6` | Banded sections — stat row, drawers |
| `--color-surface` | `#FFFFFF` | Cards — assessment, pillars, results |
| `--color-surface-muted` | `#F0F1F1` | Hover/pressed fill on a card |
| `--color-ink` | `#16181A` | Primary text, every surface |
| `--color-muted` | `#5E6265` | Secondary text, every surface |
| `--color-accent` | `#2A2E31` | Fills, emphasis text, numerals, icons |
| `--color-accent-hover` | `#15181A` | Hover / pressed / focus fill |
| `--color-accent-soft` | `#E7E8E8` | Chips, selected-option fill |
| `--color-on-accent` | `#FFFFFF` | Text and icons **on** an accent fill |
| `--color-line` | `#B9BCBB` | Card and section hairlines |
| `--color-badge-sheen` | `#E7C483` | The badge's own sheen sweep only — never as an accent |

Measured, not estimated: ink/bg 16.17 &middot; ink/raised 14.36 &middot; ink/surface 17.80 &middot;
muted/bg 5.59 &middot; muted/raised 4.97 &middot; muted/surface 6.16 &middot; accent/bg 12.44 &middot;
accent/raised 11.04 &middot; accent/surface 13.69 &middot; accent/soft 11.15 &middot;
on-accent/accent 13.69. A full rendered audit of the live page across 117 text elements returns
**zero AA failures**.

**The accent is now cleared for text at any size.** Under v2 the brass could not carry body-sized or
small text, which spawned the `-deep` / `-bright` / `-deep-ondark` variants. Those are all gone; there is
one accent and one hover value.

### Two rules that are easy to get wrong

1. **`--color-on-accent` is mandatory on any accent fill.** The accent is near-black, so `text-ink` on an
   accent background is invisible. This bit the primary button and both closing banners during the v3
   migration.
2. **The card edge is carried by `--color-line`, not by value.** `--color-surface` against `--color-bg`
   is only 1.10:1 — on a near-white ground a white card cannot separate by fill. The hairline measures
   1.74:1 on the ground and 1.91:1 on a card. Do not remove card borders and expect shadow to hold the
   shape; that was the v2 failure, where containers sat at 1.21:1 and read as one flat field.

### The badge is charcoal gunmetal, and the page is fully monochrome

The badge artwork was recoloured on 2026-08-25. The shipped PNG had a warm brown
leather field (hue 28&deg;) inside a chrome ring; the field is now charcoal
(hue 200&deg;, saturation 10%, value 74%), applied with a saturation-weighted mask so
the chrome, the barbell and the lettering were untouched. `PRODUCT.md` describes the
mark as a "cast bronze/gunmetal badge" &mdash; the original was neither, and this is
closer to the brand as written.

`--color-badge-sheen` moved with it, from warm bronze `#E7C483` to a cool near-white
specular `#E9EEF2`. A warm sweep over charcoal read as a gold halo. Metal throws a
white specular; that is what this is now.

**The consequence, stated plainly.** Principle 1 in `PRODUCT.md` is "the badge earns
its keep once, not everywhere," and under v3 the badge was the only warm object on a
near-zero-chroma page &mdash; colour was doing that work. It no longer is. The page is
now monochrome end to end, and the badge is distinguished by *detail and material*
rather than by hue. That is a deliberate trade, not an oversight: it reads more like an
instrument and less like a logo, but it leans harder on the photography and the badge's
own craft to hold attention. If the mark ever stops carrying the fold, this is the first
decision to revisit.

The original brown artwork is recoverable from git (`46c8459`, and every commit before
2026-08-25). The charcoal master lives at
`branding/final/4everfit-badge-charcoal-master.png` &mdash; outside `site/public/`, so it
is versioned but never shipped.

**Shipped as two WebPs, not one PNG.** `logo/badge.webp` (840&times;700, 117KB) serves the
intro and hero; `logo/badge-sm.webp` (160&times;133, 10KB) serves the nav and footer
lockup, which never renders above 40px. Previously a single 2.1MB PNG was sent to all
four call sites including a 28px one. WebP q90 was measured against the PNG at a mean
delta of 1.95/255 with the alpha edge bit-identical, which matters because the badge is
a cutout.

## Typography

Display/body split with a hard contrast in width and voice — a condensed all-caps display face against
a geometric sans body.

- **Display / headings / wordmark:** Bebas Neue, weight 400. **Capitals only — the face has no
  lowercase**, so every heading and the "4Ever Fit" wordmark render as caps regardless of the casing in
  the markup. `letter-spacing: 0.012em` (positive, unlike the serif it replaced), `line-height: 1.02`.
  Wordmark uses `0.045em` tracking and sits at 0.62x the badge diameter — Bebas is ~27% narrower than
  the old serif at the same size, so it needs to be set larger to balance the lockup.
- **Body:** Poppins, weights 400/500/600, plus a true 400 italic.
- **Eyebrows/labels only** (used on a handful of sections, never every section): 12px Poppins, uppercase,
  `0.1em` tracking.
- **Buttons stay on Poppins 600**, not the display face — the one conversion path is set in the body
  voice deliberately.

Hero H1 ceiling: `clamp(2.5rem, 5vw, 4.5rem)`.

### Constraints this face imposes

Bebas Neue ships **one weight and no italic**. Never apply `font-semibold`/`font-bold` or `italic` to an
element using `--font-display` — the browser synthesises both and it looks broken. The 24 `font-semibold`
utilities that used to sit alongside `font-display` were removed for this reason, and the testimonial
blockquote was moved from the display face to **Poppins Italic**, which is a real italic rather than a
sheared upright.

Poppins is geometric and sets roughly 3–5% wider than the Inter it replaced. Line lengths grew slightly;
`max-w-[Nch]` constraints were checked and none overflow, but they're worth re-checking if body copy changes.

### Decision on record: all caps

`PRODUCT.md` lists "aggressive all-caps shouting" under Big-box gym anti-references, and the previous
system called for sentence case on exactly that basis. **Bebas Neue makes caps unavoidable** — it has no
lowercase to fall back to.

This was chosen by the client on 2026-08-23 with the tradeoff stated: Anton was offered as the
alternative that *does* have lowercase and would have preserved sentence case, and Poppins-for-everything
was offered as the option that avoided caps entirely. Bebas was picked over both. Treat the anti-reference
in `PRODUCT.md` as superseded for headings specifically — not as an oversight to "fix" in a later pass.

## Layout & Components

- Radius: `--radius-sm 8px / --radius-md 14px / --radius-lg 24px / --radius-full 999px` — the badge is
  dimensional, the interface around it is allowed to be too (in contrast to the old zero-radius rule).
- Shadow: neutral (`color-mix` off `#0B0C0D`, not the old warm near-black), `--shadow-sm/md/lg` plus
  `--shadow-accent` for the primary CTA's focused/hover state, used only on the one button that matters
  most.
- Hairlines are 1px and solid `--color-line` — under v3 they are structural, not decorative, because they
  are what separates a white card from a near-white ground. See Color → "Two rules that are easy to get
  wrong."
- `.mark` is a small filled accent dot; `.mark-hollow` a ringed circle that fills with the accent when a
  step/pillar is complete — circular geometry to echo the badge.
- **`.on-surface`** (renamed from `.on-paper` in v3) marks a subtree sitting on `--color-surface` rather
  than the page ground; the logo lockup and the secondary button key off it.

## Motion

Ease-out-quart/expo, no bounce. One deliberate signature move: a slow bronze sheen sweep (`.badge-sheen`,
7s loop) on the hero badge only — "the badge earns its keep once," not on every metallic-adjacent element.
Section reveals are staggered per-item, not a uniform fade applied everywhere. All motion has a
`prefers-reduced-motion` fallback (instant/no animation).

## Imagery

Photography carries a light desaturation (`saturate(0.82) contrast(1.05)`). Under v3 this matters more
than it did before: with a near-neutral palette the photographs are the main source of colour and warmth
on the page, so they are load-bearing rather than decorative. Coach/session photography should read as
candid and current, not stock-gym-poster. Weak photography will show more here than it would have under
the cream-and-brass system.
