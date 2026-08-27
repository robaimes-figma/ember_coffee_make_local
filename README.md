# Ember Coffee Roasters

A demo codebase built to show what it looks like when designers contribute UI
changes and UI bug fixes directly to a real repository — the workflow
[Figma Make in your local codebase](https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase)
enables.

It is a small-batch coffee roastery with two surfaces sharing one design
system:

| Surface | Route | Character |
|---|---|---|
| **Storefront** | `/` | Editorial and expressive. Serif display type, product photography drawn from tokens, long-form brew guides. |
| **Roastery console** | `/admin` | Dense and functional. Tables, filters, drawers, KPI tiles. |
| **Component gallery** | `/_gallery` | Every component in every state, on one page. |

The two surfaces exist so a design change has to be *right in both places*.
A token edit that fixes the storefront and breaks the admin console is a
change you want to catch before the pull request, and this repo makes that
visible in about ten seconds.

```
pnpm install
pnpm dev          # http://localhost:5173
```

That is the whole setup. No database, no API keys, no Docker, no external
services. Node 20.19+ and pnpm.

---

## Why the repo is shaped this way

Designers can only work confidently in a codebase that is legible to them.
Four deliberate decisions do most of that work:

**1. Tokens are the single source of truth, in two layers.**
`packages/ui/src/styles/tokens.css` holds a *palette* layer (raw brand ramps,
rarely edited) and a *semantic* layer (`--sem-text-muted`, `--sem-danger`,
`--sem-roast-medium` — roles, not colours). Components only ever reference the
semantic layer. Light and dark mode are two sets of semantic values pointing at
the same palette, so fixing a role fixes both modes at once.

**2. Tailwind's stock palette is deleted.**
`theme.css` resets `--color-*`, `--font-*`, `--text-*`, `--radius-*` and
`--shadow-*` to `initial` before defining Ember's own. `bg-slate-500` doesn't
exist here. If a value isn't a token, it isn't reachable — which means a
generated change cannot quietly drift off-brand.

**3. Components are presentational; logic lives elsewhere.**
Cart maths is in `apps/web/src/lib/cart.tsx`. Data shapes are in
`packages/api`. Components receive props and render. This is the guardrail
that makes designer pull requests safe to accept: the blast radius of a change
to a component is visual by construction.

**4. Nothing clever in the styling.**
Explicit CVA variants with names that match the Figma library. No dynamic class
string construction, no deep style interpolation, no props spread through five
wrappers. A human reading `Button.tsx` and an agent reading `Button.tsx` should
reach the same conclusions.

---

## Layout

```
apps/web/                 Vite + React + TypeScript. Both route trees.
  src/pages/              Storefront pages
  src/pages/admin/        Console pages
  src/layouts/            The two shells
  src/lib/                Cart, theme, data fetching
  src/components/         App-level composites (ProductCard, CartDrawer…)

packages/ui/              The Ember design system
  src/styles/tokens.css   ← palette + semantic tokens. Start here.
  src/styles/theme.css    ← tokens → Tailwind utilities
  src/styles/base.css     ← global defaults, including the one focus ring
  src/components/         ~30 components, one per file

packages/api/             Local API: seeded catalogue, orders, reviews
  src/catalog.ts          14 hand-authored coffees
  src/seed.ts             Deterministic orders/reviews/subscriptions
  src/index.ts            Express app, mounted into Vite as middleware

docs/DEMO-BUGS.md         The planted bug backlog (facilitator key)
```

### One process, one port

The API is Express, mounted as Vite middleware in `apps/web/vite.config.ts`.
There is no second process to start and no proxy to configure — `/api/health`
answers on the same origin as the app. That matters for a tool that needs to
boot the app itself: the fewer moving parts between `pnpm dev` and a rendered
page, the fewer ways a live demo can fail.

### Deterministic data

`packages/api/src/seed.ts` generates 84 orders, ~90 reviews and 34
subscriptions from a fixed-seed PRNG. Nothing calls `Date.now()` or
`Math.random()`. A clone of this repo produces byte-identical data on every
machine, which means a screenshot in a pull request is comparable to the
reviewer's own screen, and a reported bug reproduces for everyone.

---

## This codebase contains deliberate bugs

Fifteen of them, and they are not marked in the source. They are graded from
"change a badge colour" to "this token fails contrast in dark mode across both
surfaces". `docs/DEMO-BUGS.md` is the answer sheet — **don't hand it to the
designers you're demoing to.**

Six of the fifteen are fixed in `packages/ui` or `tokens.css`, which is where
the demo gets interesting: a shared change whose effect has to be verified on
two surfaces is a real pull request, not a toy one.

---

## Working in here

```
pnpm dev          # dev server on 5173 (PORT respected)
pnpm build        # typecheck + production build
pnpm typecheck    # all three packages
pnpm lint
pnpm format
```

CI runs typecheck, lint and build. It is deliberately light: a designer whose
pull request goes red on an unrelated test has learned nothing useful, and the
point of this repo is that the review conversation is about the UI.

### The fastest loop

Open `/_gallery`, edit a value in `packages/ui/src/styles/tokens.css`, and
watch the entire system change at once. Then check `/` and `/admin` to see the
same change in context. Most token questions are answered in under a minute
that way.
