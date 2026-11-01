// Cook-along data (improved version): each step's instruction, Dr Rupy's audio, an optional photo, any timers, and
// `terms`: the phrases in the instruction to highlight (each ingredient with its amount the first time it's used, and
// the prepared ingredient when it comes back, e.g. "the diced onion").
// The instructions are written conversationally so every amount appears once, in the sentence where it's used; the
// Method tab on Recipe detail keeps DK's original wording (src/data/recipeDetail.ts).
// Audio and photos live in public/local/ (git-ignored, this machine only); steps without a photo are prep steps and
// show a placeholder.
export type Timer = { label: string; secs: number }
export type CookStep = { text: string; audio?: string; image?: string; timers?: Timer[]; terms?: string[] }
export type Cookalong = { steps: CookStep[] }

const dir = '/local/harissa'
const step = (n: number, text: string, opts: { photo?: boolean; timers?: Timer[]; terms?: string[] } = {}): CookStep => ({
  text, audio: `${dir}/step${n}.mp3`, image: opts.photo ? `${dir}/step${n}.webp` : undefined, timers: opts.timers, terms: opts.terms,
})
const min = (m: number) => m * 60

export const cookalong: Record<string, Cookalong> = {
  'one-pan-harissa-chicken-pasta': {
    // Steps 1, 2, 3, 4, 7, 8, 10 and 11 are reworded to carry their amounts; steps 5, 6 and 9 keep DK's original
    // wording. All 11 were re-recorded to match (each opens with "Step N").
    steps: [
      step(1, 'Heat 1 tbsp olive oil in a deep pan. Season 500 g boneless, skinless chicken thighs and brown them for 4 minutes per side. And use the timers below to keep track.',
        { photo: true, timers: [{ label: 'Brown the first side', secs: min(4) }, { label: 'Brown the second side', secs: min(4) }], terms: ['1 tbsp olive oil', '500 g boneless, skinless chicken thighs'] }),
      step(2, 'Dice 150 g white onion and grate 3 garlic cloves, then set them aside for the next step.',
        { terms: ['150 g white onion', '3 garlic cloves'] }),
      step(3, 'Add the diced onion to the pan with salt and cook for 6 minutes. Stir in the grated garlic, 3 tbsp harissa paste (more or less, depending on how spicy you like it), 1 tbsp tomato purée and 1 tsp ground cumin, then cook for 1 minute.',
        { photo: true, timers: [{ label: 'Cook the onion', secs: min(6) }, { label: 'Cook the spices', secs: min(1) }], terms: ['diced onion', 'grated garlic', '3 tbsp harissa paste', '1 tbsp tomato purée', '1 tsp ground cumin'] }),
      step(4, 'Dice 200 g courgette, halve 200 g baby tomatoes, and drain and rinse 1 can of chickpeas. Keep the courgette separate: it goes in first.',
        { terms: ['200 g courgette', '200 g baby tomatoes', '1 can of chickpeas'] }),
      step(5, 'Add the courgette and cook for 3 minutes until starting to soften.', { photo: true, timers: [{ label: 'Soften the courgette', secs: min(3) }], terms: ['courgette'] }),
      step(6, 'Stir in the chickpeas and tomatoes to coat in the spices.', { photo: true, terms: ['chickpeas', 'tomatoes'] }),
      step(7, 'Pour in 580 ml chicken stock and bring to a simmer. Stir in 200 g lentil pasta, nestle the chicken on top, cover and simmer for 5 minutes.',
        { photo: true, timers: [{ label: 'Simmer, covered', secs: min(5) }], terms: ['580 ml chicken stock', '200 g lentil pasta'] }),
      step(8, 'Juice half a lemon and roughly chop 15 g parsley, then set them aside for the end.',
        { terms: ['half a lemon', '15 g parsley'] }),
      step(9, 'Remove the lid and simmer uncovered for 6 minutes, stirring often, until the pasta is tender.',
        { photo: true, timers: [{ label: 'Simmer, uncovered', secs: min(6) }] }),
      step(10, 'Shred the chicken with two forks, then stir through 150 g baby spinach for 2 minutes until wilted.',
        { photo: true, timers: [{ label: 'Wilt the spinach', secs: min(2) }], terms: ['150 g baby spinach'] }),
      step(11, 'Stir in the lemon juice, season to taste, and serve topped with 150 g Greek yoghurt and the chopped parsley.',
        { photo: true, terms: ['lemon juice', '150 g Greek yoghurt', 'chopped parsley'] }),
    ],
  },
}
