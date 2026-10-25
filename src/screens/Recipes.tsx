import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { cuisines, ingredientsIndex, recipes } from '../data/recipes'
import { FilterBar } from '../components/FilterBar'
import { PageTitle, Photo, RecipeRow } from '../components/ui'
import { useFilters } from '../lib/filters'
import { applyFilters } from '../lib/query'

export function Home() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  return (
    <div className="pb-6">
      <form className="px-4" onSubmit={(e) => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(q)}`) }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ingredient, recipe name…" className="w-full border border-line rounded-md px-3 py-2" />
      </form>
      {/* UX issue U3: mixed levels (two indexes + a meal type) in a clipped row */}
      <div className="flex gap-2 px-4 mt-3 overflow-x-auto">
        <Link to="/cuisines" className="shrink-0 border border-line rounded-lg px-4 py-2">Cuisines</Link>
        <Link to="/ingredients" className="shrink-0 border border-line rounded-lg px-4 py-2">Ingredients</Link>
        <Link to="/meal/Breakfast" className="shrink-0 border border-line rounded-lg px-4 py-2">Breakfast</Link>
      </div>
      <Section title="For you" items={recipes.slice(0, 4)} />
      <Section title="High Protein" items={recipes.filter((r) => r.categories.includes('High Protein'))} showAll="/category/High Protein" />
    </div>
  )
}

function Section({ title, items, showAll }: { title: string; items: typeof recipes; showAll?: string }) {
  return (
    <section className="mt-6">
      <div className="flex justify-between items-center px-4"><h2 className="text-2xl font-semibold">{title}</h2>
        {showAll && <Link to={showAll} className="text-brand bg-brand-soft rounded px-3 py-1 text-sm">Show all</Link>}</div>
      <div className="flex gap-3 overflow-x-auto px-4 mt-3">
        {items.map((r) => (
          <Link key={r.slug} to={`/recipe/${r.slug}`} className="shrink-0 w-[335px]">
            <Photo hue={r.hue} className="h-[200px] rounded-lg" />
            <div className="font-semibold mt-2">{r.title}</div>
            <div className="text-[13px] text-muted">◷ {r.mins} mins · ⌁ {r.ingredients} ingredients{r.rating && ` · ★ ${r.rating}`}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function Index({ kind }: { kind: 'cuisines' | 'ingredients' }) {
  const { f } = useFilters()
  const names = kind === 'cuisines' ? cuisines : ingredientsIndex
  const base = kind === 'cuisines' ? '/cuisine/' : '/ingredient/'
  return (
    <div>
      <PageTitle>{kind === 'cuisines' ? 'Cuisines' : 'Ingredients'}</PageTitle>
      {/* UX issues U1/U2: one sideways row + an unrelated recipe feed underneath (as-is) */}
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
  const title = kind === 'meal' ? `${name} Recipes` : kind === 'category' ? `${name} Recipes` : `${name} Recipes`
  return (
    <div className="pb-6">
      <PageTitle>{title}</PageTitle>
      <FilterBar />
      {items.map((r) => <RecipeRow key={r.slug} r={r} />)}
      <p className="text-center italic mt-6 text-muted">Not found what you're looking for?</p>
      <div className="text-center mt-2"><button className="border border-brand text-brand rounded-lg px-5 py-1">Let us know</button></div>
    </div>
  )
}

export function Search() {
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') ?? ''
  const { f } = useFilters()
  const items = applyFilters(f, { q })
  return (
    <div className="pb-6">
      <PageTitle green={false}>Recipe search ({items.length})</PageTitle>
      {/* UX issue U4: no search field on results, query lives in a chip */}
      <FilterBar query={q} onQuery={(v) => setSp(v ? { q: v } : {})} />
      {items.map((r) => <RecipeRow key={r.slug} r={r} />)}
    </div>
  )
}

