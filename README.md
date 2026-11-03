# Nikunj Rathod — Portfolio

The portfolio is a React + TypeScript application at the repository root, built with Vite.

## Development

Use Node.js 22.12+ (Node.js 24 LTS recommended).

```sh
npm install
npm run dev
```

## Validation and production preview

```sh
npm run typecheck
npm run build
npm run preview
```

Content lives in `src/data.ts`, page components in `src/App.tsx`, and responsive styles in `src/styles.css`. The supplied resume is `public/Nikunj-Rathod-Resume.pdf`. The summary's years of experience reflect that document.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys `dist` on pushes to `main` or `master`. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Contact links open an email application; no backend is required.

Historical HTML assets and the earlier `react portfolio` Create React App prototype are retained for reference and are not part of this build. Run the commands above from the repository root.
