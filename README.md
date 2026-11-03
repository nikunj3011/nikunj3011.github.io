# Nikunj Rathod — Portfolio

The portfolio is a React + TypeScript application at the repository root, built with Vite.

## Development

Use Node.js 22.12+ (Node.js 24 LTS recommended).

```sh
npm install
npm run dev
```

Starting `npm run dev` automatically formats the active project with Prettier, applies safe ESLint fixes, and checks TypeScript before launching Vite. If a remaining lint or type error needs a code change, startup stops and prints the location. `npm start` uses the same startup checks. Formatting runs once at startup; edits during the running session still use Vite hot reload.

Prettier expands compressed JSX, TypeScript, and CSS into readable, consistently indented source. Historical website assets and the retired `react portfolio` prototype are excluded.

Useful standalone commands:

```sh
npm run format        # Apply formatting
npm run lint:fix      # Apply safe lint fixes; report remaining errors
npm run check         # Read-only formatting, lint, and TypeScript checks
```

## Validation and production preview

```sh
npm run typecheck
npm run build
npm run preview
```

Content lives in `src/data.ts`, page components in `src/App.tsx`, and responsive styles in `src/styles.css`. The supplied resume is `public/Nikunj-Rathod-Resume.pdf`. The summary's years of experience reflect that document.

## Interactive themes

Quantum is the default theme, with Space available in the theme switcher. Each refresh starts in Quantum with a new procedural scene seed; controls switch themes, generate a new scene, or toggle VFX. The Quantum visualization modes are Electron, Light, Qubit, and Entangle. On phones, a dedicated open scene area sits between the theme controls and compact experiment controls so the animation stays visible. Space uses a procedural ringed planet, starfield, and meteor trail in `src/SpaceWorld.ts`.

`src/ThemeScene.tsx` contains the lazy-loaded Three.js renderer. Nuclear + Quantum uses a white, graphite, and champagne palette with a translucent wave sculpture. `src/QuantumWorld.ts` builds four conceptual views: electron probability density, photon interference, a phase-controlled qubit, and Bell-pair correlations. There are no fixed electron orbits. Scenes use procedural geometry and shaders without remote model or texture downloads.

`src/QuantumLab.tsx` provides mode selection, measurement samples, and phase controls. The qubit uses H → Rz(φ) → H with probabilities cos²(φ/2) and sin²(φ/2); the Bell-pair view samples 00 or 11 with equal probability. Counts reset when mode or phase changes. Position flashes sample the illustrated density and fade as a fresh preparation begins. The illustrations are not a physical simulator; the expandable notes explain their scope and link to IBM Quantum Learning. `src/quantum.css` styles the white theme and `src/sections.css` carries its frosted surfaces and readable typography across all sections.

The fixed scene keeps animating as you scroll, with progressive blur and dimming behind translucent content panels. Rendering pauses in hidden tabs, uses fewer particles and a capped pixel ratio on mobile, and respects reduced-motion preferences with a static scene. Compact scene controls sit above the small profile photo; the employer caption sits below the introduction. Theme switches dispose of the previous scene's GPU resources. A CSS background remains available when WebGL is unsupported or VFX are disabled.

## Editorial motion

The visual direction uses oversized condensed typography, italic serif accents, full-screen scenes, and contrasting paper panels. Original project covers are rendered in `src/ProjectArt.tsx`; they are illustrations, not product screenshots.

`src/useEditorialMotion.ts` coordinates the opening curtain, letter reveals, hero parallax, expanding about panel, scroll-linked statement, and project-card reveals using GSAP ScrollTrigger. Projects use a responsive two-column grid that stacks on mobile, with all source and store links directly accessible. Media-query changes and unmounting revert animation state and remove listeners.

Reduced-motion mode skips the opening curtain and scroll-linked motion. Navigation highlights the current section. Styling for this composition lives in `src/editorial.css` and `src/sections.css`.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys `dist` on pushes to `main` or `master`. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Contact links open an email application; no backend is required.

Historical HTML assets and the earlier `react portfolio` Create React App prototype are retained for reference and are not part of this build. Run the commands above from the repository root.
