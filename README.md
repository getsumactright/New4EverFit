# 4Ever Fit — consultation redesign

Review build for Paul and Merle Urciaga. Astro static site in `site/`.

## Local development

Use Node 22.12 or newer. From `site/`, run `npm ci`, then `npm run dev`. Run `npm run build` for production output in `site/dist`.

## Review status

The redesign is on `codex/coaching-redesign`. Pushing this branch does not configure GitHub Pages. Existing Netlify configuration is retained; no hosting migration is included.

The consultation form is deliberately in preview mode and sends nothing. It validates input, shows a summary, and offers an optional email draft. The temporary contact is hello@wecanbuildthat.org. Replace it before deployment. No booking provider is connected.

Before launch: approve real trainer photography, final contact address, form provider and privacy policy. Configure PUBLIC_CONSULTATION_ENDPOINT, disable business.reviewMode, update the review-only privacy text, and remove the review noindex directive. Verify delivery end-to-end before publishing.

## Editing

- Business details, flexible locations, services: `site/src/config/business.ts`
- Homepage: `site/src/pages/index.astro`
- Styling: `site/src/styles/global.css`
- Consultation interaction: `site/src/scripts/consultation.ts`
- Silver intro: `site/src/components/SilverIntro.astro`

The approved silver video is retained. The coaching photograph is an AI-generated illustrative placeholder, not a depiction of the named trainers. Its visible caption states this. Prior assessment components remain in source history/unused files and are not rendered by the redesigned page.
