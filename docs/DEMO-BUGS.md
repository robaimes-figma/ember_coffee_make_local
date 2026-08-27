# The bug backlog — facilitator key

**This file is the answer sheet. Don't show it to the designers doing the demo.**

Ember ships with fifteen deliberate UI defects. They are real bugs, not
comments saying `// BUG HERE` — each one is the kind of thing that
accumulates in a production codebase, and each one is fixable by editing
presentation code rather than business logic.

They are graded by how much of the system a designer has to understand to fix
them. The grading is the demo: anyone can believe a designer changes a badge
colour, so the interesting cases are the ones at the bottom of this file.

## How to run it

1. Create the fifteen GitHub issues from the titles below (there is a script
   sketch at the end). Screenshots make them much better.
2. Give the designer the repo and the issue list, not this file.
3. Watch which grade they can clear unaided.

Every bug reproduces identically on every machine — the seed data is
deterministic, so your screenshot and theirs are comparable.

---

## Easy — a property or a single token

Fixable from the properties panel or a one-word prompt. No need to read
surrounding code.

### 1. "Low stock" badge is green

`apps/web/src/components/ProductCard.tsx`

The low-stock badge renders with `tone="success"`, so a warning reads as good
news. Visible on the home page (Nariño Anaerobic) and across the shop grid.

**Fix:** `tone="warning"`.

### 2. Order items column says "1 bags"

`apps/web/src/pages/admin/AdminOrdersPage.tsx`

The Items column interpolates a count and hardcodes the plural. Roughly half
the rows in the admin orders table read "1 bags".

**Fix:** pluralise on the count, the way `CartPage.tsx` already does.

### 3. Two roast filter chips are the same colour

`apps/web/src/pages/ShopPage.tsx` — the `roastSwatch` map

`medium-dark` points at `bg-roast-dark`, so the "Medium-dark" and "Dark"
filter chips are visually identical even though the tokens differ. Compare
against `RoastMeter`, which gets it right.

**Fix:** `'medium-dark': 'bg-roast-medium-dark'`.

### 4. Cart count badge clips at double digits

`apps/web/src/layouts/StoreLayout.tsx`

The count bubble is a fixed `size-4` circle. Add ten or more bags to the cart
and the number is clipped by its own background.

**Fix:** let it grow — `min-w-4 px-1` instead of a fixed width.

### 5. Home page section rhythm breaks at the value props

`apps/web/src/pages/HomePage.tsx` — the `ValueProps` section

Every storefront section uses `py-16 sm:py-24`. This one uses `py-8`, so the
band feels cramped against its neighbours. Obvious once you scroll the page in
one go; invisible if you only look at the section on its own.

**Fix:** match the surrounding rhythm.

---

## Medium — component work

Requires reading one component and understanding how it composes.

### 6. Long coffee names push the roast meter out of the card

`apps/web/src/components/ProductCard.tsx`

The title column lost its `min-w-0`, so `truncate` cannot take effect inside
the flex row. "Cerrado Fazenda Rainha" and "Yirgacheffe Kochere" shove the
`RoastMeter` off the right edge of the card.

**Fix:** restore `min-w-0` on the text column. Worth explaining why: `truncate`
is inert inside a flex child that is allowed to grow past its container.

### 7. Product grid jumps when data arrives

`apps/web/src/components/ProductCardSkeleton.tsx`

The skeleton renders one line of tasting notes where the real card renders two,
and omits the rating block entirely. The grid visibly reflows on every shop
page load.

**Fix:** make the skeleton mirror `ProductCard`'s actual shape. The file's own
comment says to keep them in sync.

### 8. Admin table headers scroll away

`apps/web/src/pages/admin/AdminOrdersPage.tsx`

Twelve rows per page is taller than most laptop viewports, and the `thead`
scrolls off the top with the page. By row eight nobody knows which column is
which.

**Fix:** sticky header — needs a `sticky top-0` on `TableHead` plus a
stacking context that doesn't clip it. Touches `packages/ui/src/components/Table.tsx`,
so it is the first bug where the fix belongs in the design system rather than
the app.

### 9. "Clear all" doesn't clear the search box

`apps/web/src/pages/ShopPage.tsx`

The filter rail's "Clear all" resets the URL params but leaves the `search`
state untouched, so the results stay filtered and the user cannot tell why.
The empty state's "Clear filters" button gets this right — compare the two.

**Fix:** clear both, or lift `search` into the URL params where the rest of the
filter state already lives.

### 10. Destination column pushes Total off screen

`apps/web/src/pages/admin/AdminOrdersPage.tsx`

Every cell in the row is `whitespace-nowrap` with no max width. At a ~1100px
window — a laptop with the sidebar open — "Cape Town, South Africa" forces a
horizontal scroll and the Total column leaves the viewport.

**Fix:** truncate the destination with a max width. The table already scrolls
inside `TableScroll`, so the page never breaks — the data just becomes
unreachable, which is the more insidious version of the bug.

### 11. Alert dismiss button changes colour on hover

`packages/ui/src/components/Alert.tsx`

The dismiss control is an `IconButton variant="ghost"`, whose hover style sets
`hover:text-content`. That overrides the `text-current` the Alert passes in, so
hovering the × on a danger alert turns it from red to near-black. Reproducible
on the checkout payment-failure alert and in `/_gallery`.

**Fix:** either a variant that preserves `currentColor`, or stop relying on
`text-current` here.

---

## Hard — the fix lives in the token layer or the design system

These are the ones worth demoing. Each one is a change in a shared file whose
effect has to be checked on both the storefront and the admin console.

### 12. Muted text fails contrast in dark mode

`packages/ui/src/styles/tokens.css` — the `.dark` block

`--sem-text-muted` maps to `--palette-espresso-400` (#8a7466) on a
`--palette-espresso-800` (#261a14) surface. That is roughly **3.9:1** — below
the 4.5:1 AA threshold for body text. It affects every caption, every table
cell, every product blurb, on both surfaces, in dark mode only.

**Fix:** move the dark-mode role to a lighter step — `--palette-espresso-300`
or `--palette-cream-400` — and re-check light mode is untouched. This is the
best single demonstration in the repo: one line, two surfaces, hundreds of
call sites, and `/_gallery` in dark mode shows the whole blast radius at once.

### 13. Switch has no visible focus state

`packages/ui/src/components/Switch.tsx`

The component sets `focus:outline-none`, defeating the global `:focus-visible`
ring that `base.css` gives every other control. Tab to the "Make it a
subscription" toggle on any product page: nothing happens visually. Keyboard
users cannot see where they are.

**Fix:** delete the override. The interesting part is *why* — the design system
deliberately centralises focus styling in `base.css` so that exactly this drift
cannot happen, and this component opted out of it.

### 14. Brew guide step markers overflow their circle

`apps/web/src/pages/BrewGuidePage.tsx`

The timeline marker is a fixed `size-10` circle holding `step.at`. That works
for the pour-over guide, where the values are timestamps like `0:45`. It breaks
on **Dialling in espresso**, where the values are `Step 1`…`Step 4` and the text
spills out of its circle.

**Fix:** it is not a padding tweak. The marker has to stop being a fixed-size
circle and become a pill that sizes to its content while keeping the timeline
rail aligned. A genuine small design decision, which is the point.

### 15. Modals and drawers don't trap focus

`packages/ui/src/components/Modal.tsx`, `packages/ui/src/components/Drawer.tsx`

Both close on Escape and lock body scroll, but neither moves focus into the
dialog on open, restores it on close, or prevents Tab from walking into the
page behind the overlay. Open the cart drawer and press Tab a few times — focus
disappears behind the scrim.

**Fix:** focus the panel on mount, cycle Tab within it, restore focus to the
trigger on close. Affects the storefront cart, the admin order drawer and the
product edit modal simultaneously.

---

## Grading summary

| # | Bug | Grade | Fix lives in |
|---|-----|-------|--------------|
| 1 | Low stock badge is green | Easy | App component |
| 2 | "1 bags" | Easy | App page |
| 3 | Duplicate roast swatch | Easy | App page |
| 4 | Cart badge clips | Easy | App layout |
| 5 | Section rhythm | Easy | App page |
| 6 | Long titles overflow | Medium | App component |
| 7 | Skeleton mismatch | Medium | App component |
| 8 | Headers scroll away | Medium | Design system |
| 9 | Clear all misses search | Medium | App page |
| 10 | Total pushed off screen | Medium | App page |
| 11 | Dismiss hover colour | Medium | Design system |
| 12 | Dark mode contrast | **Hard** | **Token layer** |
| 13 | Switch focus state | **Hard** | Design system |
| 14 | Step marker overflow | **Hard** | App page, needs a design call |
| 15 | No focus trap | **Hard** | Design system |

Six of the fifteen are fixed in `packages/ui` or `tokens.css` — shared files
whose changes show up on both surfaces. Those are the pull requests worth
putting in front of an engineering audience.

## Filing the issues

```bash
# From the repo root, once `gh` is authenticated and the remote exists.
gh issue create --title "Low stock badge renders green instead of amber" \
  --label "ui,good first issue" \
  --body "The low-stock badge on ProductCard uses tone=\"success\"…"
```

Repeat per bug, or paste the sections above. Screenshots are worth the effort —
they turn "spacing looks off" into something a designer can act on immediately.
