# Running the demo

A suggested run of show for showing Make in a local codebase using this repo.
Roughly 20 minutes. Adjust to the audience: engineering leads care about the
pull request, design leads care about how far a designer gets unaided.

## Before you start

- `pnpm install && pnpm dev` once, so the first run isn't happening live.
- Push the repo to GitHub. Pull request creation only works there.
- File the issues from `docs/DEMO-BUGS.md`. Screenshots make them land.
- Decide which three bugs you're doing. A good set is **#1 → #8 → #12**:
  one trivial, one component-level, one token-level.
- Have `/_gallery` open in a second tab.

## Act 1 — the codebase is real (3 min)

Show the two surfaces before mentioning Make at all.

- `/` — the storefront. Editorial, serif, expressive.
- `/admin/orders` — the console. 84 seeded orders, filters, a detail drawer.
- `/_gallery` — thirty components, every state, one page.

The point to make: these are two products with different design pressures
sharing one component library. That's the situation real teams are in, and it's
why "just let the designer edit it" normally feels risky.

Mention that the data is deterministic — same 84 orders on every machine. It
sounds like a detail; it's what makes a screenshot in a pull request
trustworthy.

## Act 2 — the easy fix (4 min)

**Bug #1: the low-stock badge is green.**

Point at it on the home page first, so the audience sees the bug before the
tool does. Then let Make fix it.

What to draw attention to in the diff: it changed `tone="success"` to
`tone="warning"` — it picked an existing variant from the design system rather
than writing a colour. There is no `#f59e0b` in the diff, because there is no
way to reach one: `theme.css` deleted Tailwind's palette.

This is the moment to say the quiet part — the guardrail isn't the tool, it's
the codebase.

## Act 3 — the component fix (5 min)

**Bug #8: admin table headers scroll away.**

Scroll the orders table until the column headers disappear. Ask the room which
column the third number is.

This fix lands in `packages/ui/src/components/Table.tsx` — a shared component,
not a page. Before showing the result, say out loud that this change affects
the products table, the inventory table and the subscriptions table too, then
go check one of them. Being seen to verify the blast radius is more persuasive
than the fix.

## Act 4 — the token fix (6 min)

**Bug #12: muted text fails contrast in dark mode.**

This is the one to spend time on.

1. Switch to dark mode on `/_gallery`. Scroll to the type and colour sections.
2. Name the number: `--sem-text-muted` on `--sem-surface` is about 3.9:1, and
   AA wants 4.5:1 for body text.
3. Let Make fix it in `packages/ui/src/styles/tokens.css`.
4. **Then check three places**: the gallery, a product page, and
   `/admin/orders`. Same one-line change, hundreds of call sites, two surfaces.
5. Check light mode is untouched — that's the part a reviewer would ask about.

The argument this makes: a designer just landed an accessibility fix in a
shared token file, and was able to verify it themselves across the whole
product before asking anyone to look.

## Act 5 — the pull request (2 min)

Open the pull request. Walk through what a reviewer actually sees:

- Small, readable diffs in the files you'd expect.
- Screenshots of both surfaces, from the template in
  `.github/pull_request_template.md`.
- `CODEOWNERS` routed the `packages/ui/src/styles/` change to the design
  systems team automatically.
- CI is green: typecheck, lint, build.

Close on the review question, not the tooling question: *is this a pull request
you'd merge?* For the three bugs above, the honest answer is usually yes — and
that is the whole pitch.

## If you have longer

- **Bug #14** (brew guide step markers overflow) is a good one to show the
  limits honestly. The fix isn't a padding tweak; the marker has to stop being
  a fixed-size circle. Watching a designer make that call in code is a better
  demo than watching a tool guess at it.
- **Bug #15** (no focus trap in modals and drawers) is the one to reach for
  with an audience that is sceptical about accessibility work landing from
  design. It touches three surfaces at once.
- Try a change you *don't* want: ask for something off-brand and show that the
  token layer has no way to express it.

## Failure modes to rehearse

- **Port already in use.** `PORT=5180 pnpm dev`.
- **A change looks right but only in light mode.** Toggle it. This happens
  often enough that it's worth building the habit on stage.
- **`pnpm dev` on a cold clone.** Run it once before the demo. `pnpm install`
  needs a network and it is the only step that does.
