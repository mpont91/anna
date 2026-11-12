# CLAUDE.md — apps/web

Architecture, conventions and commands for the site. Rules in the root
`CLAUDE.md` also apply.

## What this is

The whole site: the landing with every birthday, and one page per birthday.
Astro 7 (static output) + Vue 3 islands + Tailwind 4, TypeScript, Node 26. In
Catalan only (`<html lang="ca">`); no i18n.

## Commands

From the repo root, prefix with `web/` (`make web/dev`).

| Command        | What it does                                       |
| -------------- | -------------------------------------------------- |
| `make dev`     | Astro dev server on `WEB_PORT` (default **4321**)  |
| `make check`   | The build, which is the typecheck too              |
| `make build`   | `vue-tsc --noEmit` → `astro check` → `astro build` |
| `make preview` | Build and serve `dist/`                            |

The only npm script is `build`, because Vercel runs it.

`WEB_PORT` is read from `.env` (gitignored; copy `.env.example`) in
`astro.config.mjs`. Never hardcode a port.

## Architecture

```
src/pages/index.astro        the landing: every birthday, newest first
src/pages/<year>.astro       one birthday: <Layout> + its component (no logic)
src/birthdays/<year>/        everything that birthday needs: its components,
                             scripts and imported images
src/components/              the landing's components
src/layouts/Layout.astro     the one layout: head, favicon, analytics
src/styles/global.css        Tailwind and the few base rules every page shares
public/<year>/               files a birthday loads by URL (models, GIFs, audio)
```

**Each birthday is self-contained.** Its folder in `src/birthdays/<year>/` holds
its code; its static files live in `public/<year>/` and are referenced as
`/<year>/file.ext`. Nothing in one birthday imports from another. Its page in
`src/pages/` sets the title, the body's classes and mounts its main component,
named `Birthday<year>` (`.astro`, or `.vue` when it needs state).

**Each birthday keeps its own look.** There are no shared design tokens: every
page was designed on its own, in its own year. Tailwind is loaded everywhere; a
birthday may use it or its own scoped `<style>`. Styles stay scoped to the
birthday's components (Astro and Vue scope them), so one page can't leak into
another. The body's classes come from the page (`<Layout class="…">`).

**`.astro` vs `.vue`:** static markup, and plain `<script>` for a little
behaviour (the 29's letters, the 30's song, the 32's scroll), is `.astro`. A
`.vue` island is for real state (the 31's loader, buttons and modal). Islands
use `client:load`.

**Files, by what they are:**

- An image shown as-is in the page (photos) is imported from
  `src/birthdays/<year>/assets/` and rendered with Astro's `<Image>`, which
  resizes it and serves WebP. The 32 collects its photos with
  `import.meta.glob`.
- **A photo enters the repo already reduced:** at most 2000 px on its longest
  side, JPEG quality 82, rotation applied
  (`magick in.jpg -auto-orient -resize '2000x2000>' -strip -quality 82 out.jpg`).
  The page never shows one wider than 1000 px, so a camera original only weighs
  down the repo: the 32's photos went from 205 MB to 26 MB this way.
- Anything loaded by URL at runtime (Three.js models and textures, audio,
  animated GIFs, which `<Image>` would flatten) goes in `public/<year>/`.

## What each birthday is

| Path  | What it has                                                        |
| ----- | ------------------------------------------------------------------ |
| `/29` | A cake drawn in CSS, letters animated with anime.js                |
| `/30` | GIFs, a song on a button, the gift (a trip and a meal)             |
| `/31` | A Three.js room with a cake, candles to blow out, animated models  |
| `/32` | The trips in photos, scene by scene on scroll (GSAP), and the gift |

## Adding a birthday

1. `src/birthdays/<year>/Birthday<year>.astro` (or `.vue`), with its assets
   beside it and its runtime files in `public/<year>/`.
2. `src/pages/<year>.astro`: `<Layout title="…" class="…">` around it.
3. The landing: add it at the top of the list in
   `src/components/BirthdayList.astro`. With `isLocked: true` it shows as a
   teaser ("Properament"), without a link, until the day comes.
4. A new library goes in this app's `package.json`, on its latest stable
   version.

## Conventions

- `<script setup lang="ts">` in Vue; props through `defineProps<Props>()` with
  an `interface Props`. Typed `Props` in `.astro` components too.
- `import type { … }` for type-only imports. Imports without `.ts` extensions.
- Filenames: `PascalCase` for components, `kebab-case.ts` for everything else.
- Prettier: no semicolons, single quotes.
- Comments explain _why_; don't narrate code that reads plainly.

## Verifying a change

1. `make check` passes.
2. The affected page was loaded in a browser (`make preview`) and exercised: its
   animation, its buttons, its gift. A Playwright screenshot counts: look at it.
   Headless Chromium renders the 31's WebGL in software, too slowly for a
   screenshot; check there that every `/31/` file loads and that the page throws
   no errors.

`/_vercel/insights/script.js` answers 404 locally; it only exists on Vercel.

## Build & deploy

`astro build` emits static output to `dist/`. Vercel Analytics is wired in via
`@vercel/analytics/astro` in `Layout.astro`.

The Vercel project uses `apps/web` as its root directory and installs from the
repo root. Deployment is configured in Vercel, not in this repo.
