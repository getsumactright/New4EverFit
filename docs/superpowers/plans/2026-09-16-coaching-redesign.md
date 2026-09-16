# 4Ever Fit review redesign

Approved direction: everyday personal coaching, light graphite/silver palette, Bebas Neue headlines, brighter illustrative training photography, one dark coaching section. Keep the approved 3.625s, 960px silver video and responsive 440px ceiling.

Implementation: one responsive Astro page, shared header/footer/intro, a consultation component and controller, centralized business configuration. No deployment or account signup. New4EverFit branch codex/coaching-redesign.

1. Build hero, trainer introduction, four services, four-pillar coaching section, expectations, FAQs, consultation and footer. Use only user-confirmed credentials; no fake results, quotes, prices or app promises.
2. Centralize Sacramento/Maui locations, Instagram and temporary hello@wecanbuildthat.org email. Use explicit form review mode until a verified Formspree endpoint exists; never report delivery in review mode. Provide validation, a response summary, and a clearly labelled email-draft fallback.
3. Preserve intro asset and timing, gate downloading until playback is eligible, reduced motion/no-JS safe. Accessible mobile menu; shared DOM and persistent form on resize; conditional mobile CTA.
4. Production build. Review desktop, phone, tablet, menu, service selection, form invalid/demo states, intro asset resolution. Run Impeccable detector once and fix material findings in one batch.
5. Update design/product/readme documentation from finished implementation; leave review server running and show user local preview. External form delivery and final email remain pre-deployment requirements.
