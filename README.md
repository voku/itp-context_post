# itp-context_post

Interactive Vite demo that contrasts stale documentation with living architecture context attached directly to code.

## Live site

https://voku.github.io/itp-context_post/

## What this project shows

- A Confluence-style view that represents outdated documentation
- A code-first view that resolves architecture rules inline
- A static, production-ready deployment flow for GitHub Pages

## Requirements

- Node.js 22+
- npm 10+

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available scripts

- `npm run dev` — start the local development server
- `npm run lint` — run the TypeScript type check
- `npm run build` — create the production bundle in `dist/`
- `npm run preview` — preview the production build locally

## Production deployment

GitHub Pages deployment is automated with `.github/workflows/deploy-pages.yml`.

1. Enable **Settings → Pages → Build and deployment → Source = GitHub Actions**
2. Push to `main`
3. The workflow installs dependencies, runs `npm run lint`, builds with Vite, and deploys `dist/`

### Repository-specific Pages settings

This repository is configured for the Pages URL:

```text
https://voku.github.io/itp-context_post/
```

If you fork or rename the repository, update both:

- `vite.config.ts`
- `index.html`

## Key files

- `src/App.tsx` — top-level app shell and view switching
- `src/components/ConfluenceView.tsx` — stale documentation experience
- `src/components/ContextView.tsx` — living architecture/code context experience
- `src/components/BlogPostContent.tsx` — article-style content inside the Confluence mock
- `index.html` — favicon, SEO, Open Graph, and social preview metadata
- `vite.config.ts` — Vite setup, aliases, and GitHub Pages base path
- `.github/workflows/deploy-pages.yml` — automated Pages deployment workflow

## Key Files Detector helper prompt

```text
You are a Key Files Detector for this repository.

Goal:
- identify the smallest set of files a contributor should read before changing a feature
- prioritize files that define the user-facing behavior, core data flow, and deployment path
- explain why each file matters in one short sentence

When responding:
- start with the 3 to 7 most important files
- include exact repository-relative paths
- group files by purpose when helpful
- avoid listing generated files or dependencies unless they are directly relevant
```

## Verification

Before merging changes, run:

```bash
npm run lint
npm run build
```
