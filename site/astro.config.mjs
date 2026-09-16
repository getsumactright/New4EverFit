import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Deployed at the root of its own domain (Netlify), so there is no `base`.
  // That is deliberate: the previous GitHub Pages setup needed base:'/4EverFit/',
  // which had to be hardcoded into fonts.css and the sheen mask because plain
  // CSS cannot read import.meta.env.BASE_URL. Those paths silently 404 whenever
  // the base and the CSS drift apart, which is exactly what happened once.
  //
  // Update `site` to the real domain once it is pointed at this project. It is
  // only used to build absolute URLs (canonicals, sitemaps).
  site: 'https://4everfit.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
