import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const githubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: githubPages
    ? 'https://getsumactright.github.io'
    : 'https://new4everfit-review.pages.dev',
  base: githubPages ? '/New4EverFit/' : '/',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
