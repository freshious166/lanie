# Deployment Guide

This application is built with Vite and React, making it easy to deploy to any static site hosting provider.

## Build the App locally

To create a production build, run:

```bash
npm run build
```

This will create a `dist` directory containing the built assets.

## Deploying to Vercel (Recommended)

1.  Install the Vercel CLI (optional) or push your code to GitHub/GitLab/Bitbucket.
2.  Import your project in the [Vercel Dashboard](https://vercel.com/new).
3.  Vercel should automatically detect the Vite settings:
    *   **Build Command:** `vite build` (or `npm run build`)
    *   **Output Directory:** `dist`
4.  Add your environment variables (like `GEMINI_API_KEY`) in the Vercel Project Settings > Environment Variables.
5.  Deploy!

*Note: A `vercel.json` file is included to handle SPA routing.*

## Deploying to Netlify

1.  Push your code to a git repository.
2.  Link your repository in [Netlify](https://app.netlify.com/start).
3.  Netlify should detect the settings (or use `netlify.toml`):
    *   **Build Command:** `npm run build`
    *   **Publish directory:** `dist`
4.  Set your Environment Variables in Site settings > Build & deploy > Environment.
5.  Deploy site.

## Preview Locally

To preview the production build locally:

```bash
npm run build
npm run preview
```
