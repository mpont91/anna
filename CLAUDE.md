# CLAUDE.md — monorepo root

How this repository is organised and the rules that apply everywhere. The web
has its own `CLAUDE.md` with its architecture and conventions; read it before
working inside it.

## What this is

**Anna**: the birthday pages the owner makes for Anna every year, gathered in
one site. The landing lists every birthday, and each one lives at its own path
(`/29`, `/30`, …). Every page is a gift: personal, written in Catalan, with its
own look. There is no backend, no accounts and no data beyond what's in the
repository.

It replaces the separate repositories it was built from (`anna-birthday`, the
index, and `anna-birthday-29` … `anna-birthday-32`), which stay on GitHub as an
archive.

## Layout

```
/
└── apps/
    └── web/              the site — Astro + Vue + Tailwind, deployed to Vercel
```

npm workspaces, packages named `@app/<name>`. There is one app today; a second
one (an API, another frontend) goes under `apps/` and anything both need under
`packages/`, never "in case".

## Commands

**Everything runs through `make`, from the root.** The web's `Makefile` holds
its own targets; the root runs any of them with the `web/` prefix
(`make web/<target>`), so there's no need to `cd`.

| Command        | What it does                                                      |
| -------------- | ----------------------------------------------------------------- |
| `make install` | `npm ci` for all workspaces                                       |
| `make dev`     | The site's dev server (default port 4321)                         |
| `make check`   | **The gate:** prettier + eslint over the repo, then the build     |
| `make build`   | Typecheck (`vue-tsc`, `astro check`) and build to `apps/web/dist` |
| `make preview` | Build and serve `dist/` as it will be deployed                    |
| `make format`  | Autofix: prettier + eslint over the repo                          |

Makefiles stay simple: the commands used day to day, named so they read on their
own, with no sections and no wordy comments.

**`package.json` scripts exist only when something other than `make` calls
them:** `build` in `apps/web`, because Vercel runs it. Everything else is a
`make` target; don't add npm scripts that duplicate one.

Prettier and ESLint run once, from the root, over the whole repo: one
`.prettierrc.mjs`, one `eslint.config.mjs` (with per-folder sections). The web's
`check` is its typecheck and build.

Lines stay within 80 characters (`.editorconfig`). Prettier enforces it for code
and Markdown; elsewhere (Makefiles) wrap by hand. Tables and URLs are the only
exceptions.

Tooling every workspace uses (TypeScript, ESLint and its plugins, Prettier,
`@types/node`) is declared in the root `package.json`; what a workspace needs at
runtime, and tooling only one workspace uses, stays in that workspace.

**Dependencies are kept on their latest stable release, and updating them has
priority.** When asked to update, or when a dependency is touched anyway,
everything moves to its latest stable version, majors included: what a new major
breaks is read in its changelog and fixed in the same change, never left for
later out of caution. A deprecation the typechecker reports is fixed the same
way.

- **Stable only.** Pre-releases (`alpha`, `beta`, `rc`, `canary`, `next`) are
  never adopted, even when npm's `latest` tag points to one.
- **Held back only when something blocks it**, and the hold is written here with
  what lifts it. Today: TypeScript stays on 6 until `typescript-eslint` and
  `@astrojs/check` support 7.
- **Node is the current LTS** (26), in `engines` and `.nvmrc` (`engine-strict`
  refuses another), and `@types/node` follows its major.

npm blocks dependencies' install scripts unless they are listed in
`allowScripts` in the root `package.json` (esbuild today); a new dependency that
needs one is added there by name, after looking at what it runs. Advisories in
transitive dependencies are fixed with `npm audit fix`, never `--force`.
`npm audit` reports one it can't fix: `minimatch` inside ESLint, a dev tool that
never ships; the offered "fix" is a downgrade, so it's left until ESLint ships
one.

## Commits & PRs

Short, imperative, capitalized subjects: "Add the 33rd birthday", "Fix the
candles on mobile". No conventional-commit prefixes. One change per commit.

Commits and PRs are the owner's: no `Co-Authored-By` trailer, no "Generated
with" line, no mention of the assistant anywhere in them.

**Don't commit or push unless asked.**

## Privacy

The pages are public but personal: photos and messages for one person. Nothing
here goes to a third-party service beyond what deploying and Vercel Analytics
already send. Don't add trackers, embeds or CDNs that would learn who visits.

## The template this follows

The tooling and conventions here (the root `Makefile`, Prettier, ESLint,
TypeScript, the `CLAUDE.md` files) come from
[`mpont91/unagistart`](https://github.com/mpont91/unagistart), the owner's
template for new projects. Its product parts (auth, API, email, backups,
monitoring) don't apply to a static site and were left out on purpose.

- When a change here improves one of those generic parts (a better `Makefile`
  target, a lint rule, a convention), say so at the end of the task, so the
  owner can carry it back to the template.
- When the template has improved a generic part, this project may take it. It's
  normally cloned as a sibling (`../unagistart`); bring it up to date first
  (`git -C ../unagistart pull --ff-only`) and read it there.

## Knowledge lives in the repo

Work on this may come from another machine or a cloud session, where nothing
exists but the repository, so whatever should outlive a conversation is written
into the `CLAUDE.md` it applies to, in the same change. Never only in the
assistant's own memory. When the owner says "remember this" (or "apúntalo"), it
goes here.

## Working style

- **Think first.** State assumptions; if two readings of a request differ
  materially, ask instead of picking silently.
- **Simplest thing that works.** No speculative abstraction, no configurability
  nobody asked for.
- **Don't reinvent the wheel.** When a library, the framework or the platform
  already solves the problem, use it rather than a hand-made solution.
- **Surgical changes.** Match surrounding style even if you'd write it
  differently. A past birthday is finished: change it only to keep it working (a
  dependency update, a bug), never to redesign it.
- **Verify, don't assume.** "Done" means `make check` passed and the page was
  loaded in a browser. Report what you actually ran and what came back.
