// Cook-along data (improved version): each step's instruction, Dr Rupy's audio, an optional photo, any timers, and the
// ingredients the step uses (`uses`: names from the recipe's ingredient list, so amounts come from there).
// Steps are DK's own, supplied by the design team. Audio and photos live in public/local/ (git-ignored, this machine only);
// steps without a photo are prep steps and show a placeholder.
export type Timer = { label: string; secs: number }
export type CookStep = { text: string; audio?: string; image?: string; timers?: Timer[]; uses?: string[] }
export type Cookalong = { steps: CookStep[] }

const dir = '/local/harissa'
const step = (n: number, text: string, opts: { photo?: boolean; timers?: Timer[]; uses?: string[] } = {}): CookStep => ({
  text, audio: `${dir}/step${n}.mp3`, image: opts.photo ? `${dir}/step${n}.webp` : undefined, timers: opts.timers, uses: opts.uses,
})
const min = (m: number) => m * 60

export const cookalong: Record<string, Cookalong> = {
  'one-pan-harissa-chicken-pasta': {
    steps: [
      step(1, 'Heat olive oil in a deep pan. Season the chicken and brown for 4 minutes per side, meanwhile…',
        { photo: true, timers: [{ label: 'Brown the first side', secs: min(4) }, { label: 'Brown the second side', secs: min(4) }], uses: ['olive oil', 'chicken thigh'] }),
      step(2, 'Dice the onion and grate the garlic.', { uses: ['white onion', 'garlic cloves'] }),
      step(3, 'Add the onion to the pan with salt and cook for 6 minutes. Stir in the garlic, harissa, tomato purée, and cumin, then cook for 1 minute. Meanwhile…',
        { photo: true, timers: [{ label: 'Cook the onion', secs: min(6) }, { label: 'Cook the spices', secs: min(1) }], uses: ['white onion', 'garlic cloves', 'harissa paste', 'tomato puree', 'cumin (ground)'] }),
      step(4, 'Dice the courgette, halve the tomatoes, and rinse the chickpeas.', { uses: ['courgette', 'baby tomatoes', 'chickpeas (can)'] }),
      step(5, 'Add the courgette and cook for 3 minutes until starting to soften.', { photo: true, timers: [{ label: 'Soften the courgette', secs: min(3) }], uses: ['courgette'] }),
      step(6, 'Stir in the chickpeas and tomatoes to coat in the spices.', { photo: true, uses: ['chickpeas (can)', 'baby tomatoes'] }),
      step(7, 'Pour in the stock and bring to a simmer. Stir in the pasta, nestle the chicken on top, cover, and simmer for 5 minutes.',
        { photo: true, timers: [{ label: 'Simmer, covered', secs: min(5) }], uses: ['chicken stock', 'lentil pasta'] }),
      step(8, 'Juice the lemon and roughly chop the parsley.', { uses: ['lemon', 'parsley'] }),
      step(9, 'Remove the lid and simmer uncovered for 6 minutes, stirring often, until the pasta is tender.',
        { photo: true, timers: [{ label: 'Simmer, uncovered', secs: min(6) }] }),
      step(10, 'Shred the chicken with two forks, then stir through the spinach for 2 minutes until wilted.',
        { photo: true, timers: [{ label: 'Wilt the spinach', secs: min(2) }], uses: ['baby spinach'] }),
      step(11, 'Stir in the lemon juice, season to taste, and serve topped with yoghurt and parsley.', { photo: true, uses: ['lemon', 'greek yoghurt', 'parsley'] }),
    ],
  },
}
