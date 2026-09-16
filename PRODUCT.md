# Product

## Register

brand

## Users

People who want one-on-one, camera-on personal training and are willing to pay a premium for a real coach
instead of a copy-paste program — 30s-50s, disposable income, tried gyms/apps before and didn't stick with
them because nobody was watching. They land here from a referral or an ad, on a phone most of the time.
They're not browsing; they're deciding in under a minute whether this feels credible or feels like every
other fitness funnel they've bounced off of.

The job to be done: figure out fast whether this coach/system is legitimate, see themselves in the four-pillar
structure (Nutrition, Strength training, Cardio, Supplementation), and take the smallest possible next step —
a 4-question assessment — without being asked for a card or sat through a sales call.

## Product Purpose

This is the introduction layer in front of the 4EverFit mobile app, not the product itself. The app is where
coaching actually happens (plans, check-ins, login); this page's only jobs are (1) make the four-pillar system
and the coach feel credible and premium in under 30 seconds, and (2) get the visitor through the 4-question
pillar assessment, which becomes their reason to install and log into the app — the assessment answers seed
their starting plan on the other side. No pricing, no booking calendar, no separate "download the app" CTA
competing with the assessment: the assessment *is* the on-ramp to the app, not an alternative to it.

Success = assessment completions that convert to app installs, not raw traffic or time-on-page.

## Brand Personality

Boutique, not big-box. Earned, not hyped. Warm-premium — the feeling of a well-made physical object (the
client's actual mark is a cast bronze/gunmetal badge, not a flat app icon), applied to a digital product
without pretending to be a metal object itself. Confident and calm rather than shouty: no countdown timers,
no fake scarcity, no "transform your life" copy. A modern twist on that boutique-gym warmth — current,
uncluttered, mobile-first — not a retro/varsity pastiche of the badge and not a cold SaaS dashboard either.

Three words: **disciplined, warm, current.**

## Anti-references

- The site's own previous direction ("Counted Weight" — flat, zero-radius, red-accent brutalist minimalism).
  It was designed around a different, since-abandoned logo concept and visually fights the new bronze/gunmetal
  badge mark. Do not carry its flat/no-shadow/no-warmth rules forward.
- Generic AI-website scaffolding: tiny uppercase tracked eyebrows on every section, gradient-clipped headline
  text, identical icon-card grids, the hero-metric-with-gradient-blob template, glassmorphism as decoration,
  numbered 01/02/03 section markers used as reflex rather than because the content is genuinely sequential.
- Big-box gym marketing: neon greens, motivational-poster stock photography, countdown-timer urgency,
  before/after ad clichés, aggressive all-caps shouting.
- Cold SaaS/app-store aesthetic (generic blue gradients, generic "download our app" hero) — this is a coaching
  relationship first, an app second.

## Design Principles

1. **The badge earns its keep once, not everywhere.** It's dimensional and warm; the interface around it
   should be quiet enough that the mark still reads as the one crafted object on the page, not one metallic
   element among many competing textures.
2. **Four pillars, structurally present, not illustrated.** Nutrition / Strength / Cardio / Supplementation is
   the whole selling proposition — every major section should either build toward it or reference it, not
   just the one pillar block.
3. **One conversion path.** The assessment is the only ask. Every CTA on the page points at it; nothing
   competes with it (no pricing table, no calendar, no separate app-download button above the fold).
4. **Mobile is the primary surface**, not a shrink of desktop — most visitors will arrive on a phone and the
   destination (the app) is a phone experience; the page should feel like a natural on-ramp to that, not a
   different medium.
5. **Show the coaching, not just the claim.** Prefer specific, concrete detail (what a session actually
   involves, what the plan looks like) over adjectives like "transform" or "elite."

## Accessibility & Inclusion

WCAG 2.1 AA minimum, carried forward from the existing build: real semantic form controls (not styled divs)
in the assessment, visible keyboard focus states, a polite live region announcing quiz step changes, focus
management on step change, single-open accordion semantics via native `<details>`, reduced-motion alternatives
for every animation, and body-text contrast ≥4.5:1 against the new warmer palette (the previous build's
accent-at-body-size rule — always step up to a darker accent token at paragraph size — should carry forward
under the new palette too).
