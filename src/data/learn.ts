// Mock Learn content. Titles and text are made up for the prototype: do not copy the live app's articles, episodes or videos.
export type Kind = 'read' | 'listen' | 'watch'
export type Item = { id: string; kind: Kind; topics: string[]; title: string; date: string; hue: number; forYou?: boolean; recent?: boolean }
export type Topic = { slug: string; name: string; icon: string; hue: number }

// The category chips on Learn home, in two rows (even indexes on top) and the Read / Listen / Watch lists. "What to eat for" and "Ingredients" open a grid of topics.
export const CHIPS: Topic[] = [
  { slug: 'what-to-eat-for', name: 'What to eat for', icon: '💚', hue: 90 },
  { slug: 'cooking-skills', name: 'Cooking skills', icon: '🍳', hue: 30 },
  { slug: 'ingredients', name: 'Ingredients', icon: '🍓', hue: 0 },
  { slug: 'mindset', name: 'Mindset', icon: '🧠', hue: 25 },
  { slug: 'hot-topics', name: 'Hot topics', icon: '🔥', hue: 15 },
  { slug: 'nutrition-basics', name: 'Nutrition basics', icon: '🥦', hue: 200 },
]
export const HEALTH_TOPICS: Topic[] = [
  ['gut-health', 'Gut health', '🦠'], ['immunity', 'Immunity & inflammation', '🔥'], ['heart', 'Heart health & cholesterol', '❤️'],
  ['mind', 'Mind & mood', '🙂'], ['menopause', 'Menopause', '🌸'], ['hormones', 'Hormones & period health', '🌙'],
  ['diabetes', 'Type 2 diabetes', '🩸'], ['weight', 'Healthy weight', '⚖️'], ['sleep', 'Sleep & energy', '😴'],
  ['fitness', 'Fitness', '🏋️'], ['ageing', 'Healthy ageing', '🌳'], ['allergies', 'Seasonal allergies', '🤧'],
  ['brain', 'Brain health', '🧩'], ['cancer', 'Cancer', '🎗️'],
].map(([slug, name, icon], i) => ({ slug, name, icon, hue: 200 + i * 9 }))
export const INGREDIENT_TOPICS: Topic[] = [
  ['nuts-seeds', 'Nuts & seeds', '🌰'], ['potato', 'Potato', '🥔'], ['apple', 'Apple', '🍎'],
].map(([slug, name, icon], i) => ({ slug, name, icon, hue: 20 + i * 30 }))
export const ALL_TOPICS = [...CHIPS, ...HEALTH_TOPICS, ...INGREDIENT_TOPICS]
export const topic = (slug: string) => ALL_TOPICS.find((t) => t.slug === slug)

const it = (id: string, kind: Kind, topics: string[], title: string, date: string, hue: number, flags: Partial<Item> = {}): Item => ({ id, kind, topics, title, date, hue, ...flags })
// Cooking skills has no articles and Mindset has no videos, so the empty filtered lists (Learn !4) can be reached.
export const items: Item[] = [
  it('w1', 'watch', ['gut-health'], 'Five-minute high-protein breakfast pots to prep the night before', '2026-08-30', 35, { forYou: true }),
  it('w2', 'watch', ['gut-health'], 'A high-protein, high-fibre salad for a happy gut', '2026-08-22', 110, { forYou: true }),
  it('l1', 'listen', ['hot-topics', 'immunity'], 'The food groups that help calm inflammation', '2026-10-12', 210, { recent: true }),
  it('l2', 'listen', ['immunity'], 'An anti-inflammatory day, from breakfast to dinner', '2026-10-05', 330, { recent: true }),
  it('w3', 'watch', ['cooking-skills'], 'A 20-minute pasta that doubles the protein', '2026-07-30', 20),
  it('l3', 'listen', ['nutrition-basics'], "A nutritionist's guide to getting enough protein", '2026-07-18', 300),
  it('l4', 'listen', ['gut-health'], 'Signs you need more fibre, and how to add it without bloating', '2026-07-15', 260),
  it('w4', 'watch', ['cooking-skills'], 'What I eat in a day for protein and fibre', '2026-06-28', 45),
  it('l5', 'listen', ['weight'], 'Foods that support a healthy weight', '2026-06-20', 190),
  it('l6', 'listen', ['brain'], 'Eating for a clearer, calmer mind', '2026-06-02', 230),
  it('l7', 'listen', ['gut-health'], 'Easing bloating with everyday foods', '2026-05-24', 15),
  it('l8', 'listen', ['gut-health'], 'Seven benefits of eating more fibre', '2026-05-11', 280),
  it('w5', 'watch', ['cooking-skills'], 'Three high-protein lunches to batch cook', '2026-05-02', 60),
  it('r1', 'read', ['gut-health'], 'How to ease constipation with food', '2026-04-20', 40),
  it('r2', 'read', ['immunity'], 'Five steps to eating better this year', '2026-01-05', 100),
  it('r3', 'read', ['hot-topics'], 'Our year in review', '2025-12-20', 150),
  it('r4', 'read', ['nuts-seeds'], 'What are chia seeds good for?', '2025-12-06', 5),
  it('r5', 'read', ['potato'], 'Are potatoes healthy?', '2025-11-14', 45),
  it('r6', 'read', ['apple'], 'The health benefits of eating apples', '2025-10-30', 0),
  it('r7', 'read', ['nuts-seeds'], 'Flaxseeds: a small seed with big benefits', '2025-10-02', 30),
  it('r8', 'read', ['nuts-seeds'], 'Nuts and a healthy weight', '2025-09-15', 25),
  it('r9', 'read', ['ageing', 'mindset', 'nutrition-basics'], 'Five habits for good health', '2025-09-01', 120),
  it('r10', 'read', ['nutrition-basics', 'mindset'], 'Why eating together matters', '2025-08-20', 10),
  it('l9', 'listen', ['mindset'], 'Phone breaks, time outdoors and your mood', '2025-08-04', 130),
  it('l10', 'listen', ['mindset'], 'Your story and your health', '2025-07-21', 340),
  it('w6', 'watch', ['ageing'], 'The longevity foods I eat every week', '2025-07-10', 70),
  it('w7', 'watch', ['nutrition-basics'], 'Protein for energy, hormones and ageing', '2025-06-25', 350),
  it('l11', 'listen', ['heart'], 'Food and cholesterol: what really matters', '2025-06-12', 0),
  it('w8', 'watch', ['fitness'], 'Fuelling a workout without the shakes', '2025-05-30', 160),
  it('r11', 'read', ['sleep'], 'Foods for better sleep', '2025-05-12', 250),
]
export const label = (i: Item) => topic(i.topics[0])?.name.toUpperCase() ?? ''
export const KIND = { read: { badge: '📖 READ', list: 'Articles', one: 'articles' }, listen: { badge: '🎙 LISTEN', list: 'Podcasts', one: 'podcasts' }, watch: { badge: '🎬 WATCH', list: 'Videos', one: 'videos' } }

// "Nutrition basics with Dr Rupy" course carousel on Learn home.
export const course = [
  ['A personal welcome', '38s'], ['Colourful plants', '1m 12s'], ['Fibre first', '1m 40s'], ['Protein through the day', '2m 05s'],
  ['Healthy fats', '1m 30s'], ['Herbs and spices', '1m 15s'], ['Eating together', '1m 02s'], ['Putting it together', '2m 20s'],
]
