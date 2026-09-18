const githubPages = process.env.GITHUB_PAGES === 'true';

// Inside defineConfig, keep the existing Vite settings:
site: githubPages
  ? 'https://getsumactright.github.io'
  : 'https://new4everfit-review.pages.dev',
base: githubPages ? '/New4EverFit/' : '/',
