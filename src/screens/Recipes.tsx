import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { cuisines, ingredientsIndex, mealTypes, recipes } from '../data/recipes'
import { FilterBar, FiltersSheet } from '../components/FilterBar'
import { Heart, Icon, Meta, PageTitle, Photo, RecipeRow, Stars } from '../components/ui'
import { useFilters } from '../lib/filters'
import { applyFilters } from '../lib/query'
import { useProgress } from '../lib/progress'
import { useImproved } from '../lib/version'

// "For you" leads with the Harissa pasta, the recipe with real photos and a cook-along.
const FIRST = 'one-pan-harissa-chicken-pasta'
const forYou = [recipes.find((r) => r.slug === FIRST)!, ...recipes.filter((r) => r.slug !== FIRST).slice(0, 3)]

export function Home() {
  const nav = useNavigate()
  const improved = useImproved()
  const [searching, setSearching] = useState(false)
  return (
    <div className="pb-6">
      {/* Tapping the field opens the Recipe search sheet, as in the app; Apply goes to the results */}
      <div className="px-4">
        <button onClick={() => setSearching(true)} className="w-full flex items-center gap-2 border border-line rounded-md px-3 py-2 text-left text-muted">Search by ingredient, recipe name…</button>
      </div>
      {searching && <FiltersSheet focus onClose={() => setSearching(false)} onQuery={(q) => nav(q ? `/search?q=${encodeURIComponent(q)}` : '/search')} />}
      {improved ? <>
        {/* IMPROVED (UX issue U3): a "Browse by" section with three entries of the same kind, all visible */}
        <h2 className="px-4 mt-5 text-[19px] font-semibold">Browse by</h2>
        <div className="grid grid-cols-3 gap-3 px-4 mt-2">
          {[['/cuisines', 'Cuisines'], ['/ingredients', 'Ingredients'], ['/meals', 'Meal types']].map(([to, name]) => (
            <Link key={to} to={to} className="border border-line rounded-lg py-3 text-center text-[15px]">{name}</Link>
          ))}
        </div>
      </> : (
        // AS-IS (UX issue U3): mixed levels (two indexes + a meal type) in a clipped row
        <div className="flex gap-2 px-4 mt-3 overflow-x-auto">
          <Link to="/cuisines" className="shrink-0 border border-line rounded-lg px-4 py-2">Cuisines</Link>
          <Link to="/ingredients" className="shrink-0 border border-line rounded-lg px-4 py-2">Ingredients</Link>
          <Link to="/meal/Breakfast" className="shrink-0 border border-line rounded-lg px-4 py-2">Breakfast</Link>
        </div>
      )}
      <Section title="For you" items={forYou} />
      <Section title="High Protein" items={recipes.filter((r) => r.categories.includes('High Protein'))} showAll="/category/High Protein" />
    </div>
  )
}

function Section({ title, items, showAll }: { title: string; items: typeof recipes; showAll?: string }) {
  const improved = useImproved()
  return (
    <section className="mt-6">
      <div className="flex justify-between items-center px-4"><h2 className="text-2xl font-semibold">{title}</h2>
        {showAll && <Link to={showAll} className="text-brand bg-brand-soft rounded px-3 py-1 text-sm">Show all</Link>}</div>
      <div className="flex gap-3 overflow-x-auto px-4 mt-3">
        {items.map((r) => (
          <Link key={r.slug} to={`/recipe/${r.slug}`} className="shrink-0 w-[335px]">
            <div className="relative"><Photo hue={r.hue} src={r.image} className="h-[200px] rounded-lg" /><Heart /></div>
            <div className="font-semibold mt-2">{r.title}</div>
            <div className="text-[13px] text-muted flex items-center gap-1 flex-wrap">
              <Meta r={r} inline />
              {r.rating ? <><span>·</span><Stars value={r.rating} /></> : improved && <span>· No ratings yet</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

const INDEX = {
  cuisines: { title: 'Cuisines', names: cuisines, base: '/cuisine/', of: (r: (typeof recipes)[number]) => r.cuisine },
  ingredients: { title: 'Ingredients', names: ingredientsIndex, base: '/ingredient/', of: (r: (typeof recipes)[number]) => r.mainIngredient },
  meals: { title: 'Meal types', names: mealTypes, base: '/meal/', of: (r: (typeof recipes)[number]) => r.mealType },
}
export function Index({ kind }: { kind: keyof typeof INDEX }) {
  const { f } = useFilters()
  const { title, names, base, of } = INDEX[kind]
  const count = (n: string) => recipes.filter((r) => of(r) === n).length
  // IMPROVED (UX issues U1 and U2): a pure browse grid, two columns, full names under the image and a recipe count.
  if (useImproved()) return (
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
  // AS-IS (UX issues U1/U2): one sideways row + an unrelated recipe feed underneath
  return (
    <div>
      <PageTitle>{title}</PageTitle>
      <div className="flex gap-3 overflow-x-auto px-4 mt-3">
        {names.map((n, i) => (
          <Link key={n} to={base + n} className="relative shrink-0 w-[133px] h-[133px] rounded-lg overflow-hidden">
            <Photo hue={i * 47} className="absolute inset-0" />
            <span className="absolute bottom-0 inset-x-0 bg-black/55 text-white text-sm px-2 py-1 truncate">{n}</span>
          </Link>
        ))}
      </div>
      <FilterBar />
      {applyFilters(f).map((r) => <RecipeRow key={r.slug} r={r} />)}
    </div>
  )
}

export function List({ kind }: { kind: 'cuisine' | 'ingredient' | 'meal' | 'category' }) {
  const { name = '' } = useParams()
  const { f } = useFilters()
  const items = applyFilters(f, { [kind === 'meal' ? 'meal' : kind === 'category' ? 'cat' : kind]: name })
  return (
    <div className="pb-6">
      <PageTitle>{name} Recipes</PageTitle>
      <FilterBar />
      {items.map((r) => <RecipeRow key={r.slug} r={r} />)}
      <p className="text-center italic mt-6 text-muted">Not found what you're looking for?</p>
      <div className="text-center mt-2"><button className="border border-brand text-brand rounded-lg px-5 py-1">Let us know</button></div>
    </div>
  )
}

// IMPROVED (UX issue U4): a real search field on the results, with a clear button.
function SearchField({ value, onSearch }: { value: string; onSearch: (v: string) => void }) {
  const [v, setV] = useState(value)
  return (
    <form className="relative px-4" onSubmit={(e) => { e.preventDefault(); onSearch(v.trim()) }}>
      <Icon name="search" size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" />
      <input value={v} onChange={(e) => setV(e.target.value)} enterKeyHint="search" placeholder="Search by ingredient, recipe name…" className="w-full border border-line rounded-md pl-9 pr-10 py-2" />
      {v && <button type="button" aria-label="Clear search" onClick={() => { setV(''); onSearch('') }} className="absolute right-4 top-0 bottom-0 w-10 text-muted grid place-items-center"><Icon name="close" size={20} /></button>}
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
  const setQuery = (v: string) => setSp({ ...(v ? { q: v } : {}), ...(log ? { log } : {}) })
  return (
    <div className="pb-6">
      <PageTitle green={false}>Recipe search ({items.length})</PageTitle>
      {useImproved()
        // IMPROVED (UX issue U4): the search field stays pinned above the results, with the filter bar
        ? <div className="sticky top-0 z-10 bg-white pt-2"><SearchField key={q} value={q} onSearch={setQuery} /><FilterBar /></div>
        // AS-IS (UX issue U4): no search field on results, query lives in a chip
        : <FilterBar query={q} onQuery={setQuery} />}
      {items.map((r) => <RecipeRow key={r.slug} r={r} corner={log ? <>
        <Heart />
        <button onClick={(e) => { e.preventDefault(); logIt(r.slug) }} className="absolute top-1 right-1 inline-flex items-center bg-brand text-white text-[13px] rounded-full pl-1 pr-2 py-0.5"><Icon name="add" size={16} />Add</button>
      </> : undefined} />)}
    </div>
  )
}
