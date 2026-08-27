import type { BrewGuide } from './types'

/**
 * Editorial brew guides. These carry the long-form typography on the
 * storefront — the place where the display serif and the prose measure
 * actually get tested.
 */
export const brewGuides: BrewGuide[] = [
  {
    slug: 'pour-over-v60',
    title: 'Pour-over, the version that actually works',
    method: 'filter',
    summary:
      'One pour-over recipe, tuned so it survives being made by a person who has not had coffee yet. Four pours, three minutes, no scale acrobatics.',
    minutes: 4,
    difficulty: 'easy',
    ratio: '1:16 — 22g coffee, 350g water',
    temperatureCelsius: 94,
    gear: ['V60 or similar cone', 'Paper filter', 'Gooseneck kettle', 'Scale', 'Burr grinder'],
    steps: [
      {
        at: '0:00',
        title: 'Rinse and bloom',
        detail:
          'Rinse the filter with hot water to kill the paper taste and warm the cone. Add the grounds, level them, then pour 60g of water in a slow spiral. The bed should swell and smell like the dry grounds only louder.',
      },
      {
        at: '0:45',
        title: 'First pour',
        detail:
          'Pour to 180g in gentle concentric circles, staying off the paper. If the bed stalls, your grind is too fine — note it and fix it next time rather than fighting it now.',
      },
      {
        at: '1:30',
        title: 'Second pour',
        detail:
          'Pour to 270g. The slurry level should stay roughly constant rather than draining fully between pours. Keeping the bed submerged is what evens out extraction.',
      },
      {
        at: '2:10',
        title: 'Final pour and drawdown',
        detail:
          'Pour to 350g, then give the cone a single gentle swirl to flatten the bed. Total drawdown should finish between 3:00 and 3:30. Longer means grind coarser; shorter means grind finer.',
      },
    ],
  },
  {
    slug: 'espresso-dialling-in',
    title: 'Dialling in espresso without wasting a bag',
    method: 'espresso',
    summary:
      'Change one variable at a time and you can find a good shot in six attempts instead of thirty. Here is the order to change them in.',
    minutes: 20,
    difficulty: 'advanced',
    ratio: '1:2 — 18g in, 36g out',
    temperatureCelsius: 93,
    gear: ['Espresso machine', 'Burr grinder', 'Scale', 'Distribution tool', 'Tamper'],
    steps: [
      {
        at: 'Step 1',
        title: 'Fix your dose and your ratio',
        detail:
          'Weigh 18g in and pull until the cup reads 36g. Do not change either number again until the shot tastes balanced. Every other variable is easier to read when these two are nailed down.',
      },
      {
        at: 'Step 2',
        title: 'Move grind size only',
        detail:
          'Aim for 27 to 32 seconds. Faster than that, grind finer. Slower, grind coarser. Make one adjustment per shot, and taste every shot even when the timing looks wrong.',
      },
      {
        at: 'Step 3',
        title: 'Read the taste, not the clock',
        detail:
          'Sour and thin means under-extracted: grind finer. Bitter and drying means over-extracted: grind coarser. Hollow in the middle usually means channelling, which is a distribution problem, not a grind problem.',
      },
      {
        at: 'Step 4',
        title: 'Only now touch temperature',
        detail:
          'Once timing and taste are close, move brew temperature in one-degree steps. Lighter roasts generally want more heat; dark roasts want less. This is a finishing move, not a starting one.',
      },
    ],
  },
  {
    slug: 'french-press-clean-cup',
    title: 'French press without the sludge',
    method: 'french-press',
    summary:
      'The press gets a bad reputation because of one habit: plunging. Skip it and you get an immersion brew as clean as a filter.',
    minutes: 9,
    difficulty: 'easy',
    ratio: '1:15 — 30g coffee, 450g water',
    temperatureCelsius: 96,
    gear: ['French press', 'Scale', 'Burr grinder', 'Spoon'],
    steps: [
      {
        at: '0:00',
        title: 'Coarse grind, all the water at once',
        detail:
          'Grind coarse — think sea salt. Add all 450g of water in one go and give it a single stir to wet every ground.',
      },
      {
        at: '4:00',
        title: 'Break the crust',
        detail:
          'A raft of grounds will have formed on top. Stir it once so it sinks. Most of the fines go with it.',
      },
      {
        at: '8:00',
        title: 'Skim, then pour without plunging',
        detail:
          'Skim any remaining foam off the surface, rest the plunger on top of the water without pushing, and pour slowly. The grounds stay at the bottom where they belong.',
      },
    ],
  },
  {
    slug: 'moka-pot',
    title: 'The moka pot, treated properly',
    method: 'moka',
    summary:
      'Pre-boiled water and a low flame turn the moka pot from a scorched-metal machine into a genuinely sweet brewer.',
    minutes: 6,
    difficulty: 'medium',
    ratio: 'Fill the basket level — roughly 1:10',
    temperatureCelsius: 100,
    gear: ['Moka pot', 'Kettle', 'Burr grinder', 'Tea towel'],
    steps: [
      {
        at: '0:00',
        title: 'Start with boiling water',
        detail:
          'Fill the base with already-boiling water to just below the valve. This is the whole trick: it means the coffee is not sitting over a heat source while the water slowly comes up to temperature.',
      },
      {
        at: '0:30',
        title: 'Fill the basket, do not tamp',
        detail:
          'Grind a little coarser than espresso. Fill the basket level and level it off with a finger. Tamping a moka basket builds pressure it was never designed for.',
      },
      {
        at: '1:00',
        title: 'Low flame, lid open',
        detail:
          'Assemble with a towel — the base is hot — and put it on the lowest flame that works. Watch it. You want a slow, honey-coloured stream, not a sputtering geyser.',
      },
      {
        at: '4:00',
        title: 'Pull it early',
        detail:
          'The moment the stream turns pale and starts to hiss, take it off the heat and run the base under cold water. Everything after that point is bitterness.',
      },
    ],
  },
]

export const brewGuideBySlug = new Map(brewGuides.map((guide) => [guide.slug, guide]))
