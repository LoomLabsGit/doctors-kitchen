import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { cuisines, ingredientsIndex, mealTypes, recipes } from '../data/recipes'
import { FilterBar } from '../components/FilterBar'
import { Nutrition, PageTitle, Photo, Rating, RecipeRow } from '../components/ui'
import { useFilters } from '../lib/filters'
import { applyFilters } from '../lib/query'
import { useProgress } from '../lib/progress'

export function Home() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  return (
    <div className="pb-6">
      <form className="px-4" onSubmit={(e) => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(q)}`) }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ingredient, recipe name…" className="w-full border border-line rounded-md px-3 py-2" />
      </form>
      {/* FIXED (UX issue U3): a "Browse by" section with three entries of the same kind, all visible.
          Before: a clipped chip row mixing two indexes with one meal type (Breakfast). */}
      <h2 className="px-4 mt-5 text-[19px] font-semibold">Browse by</h2>
      <div className="grid grid-cols-3 gap-3 px-4 mt-2">
        {[['/cuisines', 'Cuisines', '🌍'], ['/ingredients', 'Ingredients', '🥕'], ['/meals', 'Meal types', '🍽']].map(([to, name, icon]) => (
          <Link key={to} to={to} className="border border-line rounded-lg py-3 text-center text-[15px]"><div className="text-2xl">{icon}</div>{name}</Link>
        ))}
      </div>
      <Section title="For you" items={recipes.slice(0, 4)} />
      <Section title="High Protein" items={recipes.filter((r) => r.categories.includes('High Protein'))} showAll="/category/High Protein" protein />
    </div>
  )
}

function Section({ title, items, showAll, protein }: { title: string; items: typeof recipes; showAll?: string; protein?: boolean }) {
  return (
    <section className="mt-6">
      <div className="flex justify-between items-center px-4"><h2 className="text-2xl font-semibold">{title}</h2>
        {showAll && <Link to={showAll} className="text-brand bg-brand-soft rounded px-3 py-1 text-sm">Show all</Link>}</div>
      <div className="flex gap-3 overflow-x-auto px-4 mt-3">
        {items.map((r) => (
          <Link key={r.slug} to={`/recipe/${r.slug}`} className="shrink-0 w-[335px]">
            <Photo hue={r.hue} className="h-[200px] rounded-lg" />
            <div className="font-semibold mt-2">{r.title}</div>
            <div className="text-[13px] text-muted">◷ {r.mins} mins · ⌁ {r.ingredients} ingredients · <Rating r={r} /></div>
            <div className="text-[13px] text-muted"><Nutrition r={r} protein={protein} /></div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// FIXED (UX issues U1 and U2): a pure browse grid, two columns, full names under the image and a recipe count.
// Before: one sideways row of tiles with truncated names, and an unrelated recipe feed underneath.
const INDEX = {
  cuisines: { title: 'Cuisines', names: cuisines, base: '/cuisine/', of: (r: (typeof recipes)[number]) => r.cuisine },
  ingredients: { title: 'Ingredients', names: ingredientsIndex, base: '/ingredient/', of: (r: (typeof recipes)[number]) => r.mainIngredient },
  meals: { title: 'Meal types', names: mealTypes, base: '/meal/', of: (r: (typeof recipes)[number]) => r.mealType },
}
export function Index({ kind }: { kind: keyof typeof INDEX }) {
  const { title, names, base, of } = INDEX[kind]
  const count = (n: string) => recipes.filter((r) => of(r) === n).length
  return (
    <div className="pb-6">
      <PageTitle>{title}</PageTitle>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-4 mt-3">
        {names.map((n, i) => (
          <Link key={n} to={base + n} className="block min-w-0">
            <Photo hue={i * 47} className="aspect-square rounded-lg" />
            <div className="font-semibold text-[16px] leading-tight mt-2">{n}</div>
            <div className="text-[13px] text-muted">{count(n)} recipe{count(n) === 1 ? '' : 's'}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function List({ kind }: { kind: 'cuisine' | 'ingredient' | 'meal' | 'category' }) {
  const { name = '' } = useParams()
  const { f } = useFilters()
  const items = applyFilters(f, { [kind === 'meal' ? 'meal' : kind === 'category' ? 'cat' : kind]: name })
  const title = kind === 'meal' ? `${name} Recipes` : kind === 'category' ? `${name} Recipes` : `${name} Recipes`
  return (
    <div className="pb-6">
      <PageTitle>{title}</PageTitle>
      <FilterBar />
      {items.map((r) => <RecipeRow key={r.slug} r={r} protein={name === 'High Protein'} />)}
      <p className="text-center italic mt-6 text-muted">Not found what you're looking for?</p>
      <div className="text-center mt-2"><button className="border border-brand text-brand rounded-lg px-5 py-1">Let us know</button></div>
    </div>
  )
}

function SearchField({ value, onSearch }: { value: string; onSearch: (v: string) => void }) {
  const [v, setV] = useState(value)
  return (
    <form className="relative px-4" onSubmit={(e) => { e.preventDefault(); onSearch(v.trim()) }}>
      <input value={v} onChange={(e) => setV(e.target.value)} enterKeyHint="search" placeholder="Search by ingredient, recipe name…" className="w-full border border-line rounded-md pl-3 pr-10 py-2" />
      {v && <button type="button" aria-label="Clear search" onClick={() => { setV(''); onSearch('') }} className="absolute right-4 top-0 bottom-0 w-10 text-muted text-xl">×</button>}
    </form>
  )
}

export function Search() {
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') ?? ''
  const { f } = useFilters()
  const items = applyFilters(f, { q })
  // Route A from Progress' Add meal sheet: `log` is the day the meal goes to. Each row gets a "+ Add" tab.
  const log = sp.get('log')
  const { add } = useProgress()
  const nav = useNavigate()
  const logIt = (slug: string) => { add({ date: log!, slug }); nav(`/progress?d=${log}`, { state: { toast: 'The recipe has been added' } }) }
  return (
    <div className="pb-6">
      <PageTitle green={false}>Recipe search ({items.length})</PageTitle>
      {/* FIXED (UX issue U4): the search field stays pinned above the results, and filters sit behind one button
          with a count. Before: no search field on results; the query was a chip mixed in with the filters. */}
      <div className="sticky top-0 z-10 bg-white pt-2">
        <SearchField key={q} value={q} onSearch={(v) => setSp({ ...(v ? { q: v } : {}), ...(log ? { log } : {}) })} />
        <FilterBar />
      </div>
      {items.map((r) => <RecipeRow key={r.slug} r={r} corner={log ? <>
        <span className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 grid place-items-center text-sm">♡</span>
        <button onClick={(e) => { e.preventDefault(); logIt(r.slug) }} className="absolute top-1 right-1 bg-brand text-white text-[13px] rounded-full px-2 py-0.5">+ Add</button>
      </> : undefined} />)}
    </div>
  )
}

