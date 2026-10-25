import { useState } from 'react'
import { useFilters, DEFAULT_FILTERS, type Filters } from '../lib/filters'
import { Chip, Sheet } from './ui'
import { allergens, categories, diets, mealTypes } from '../data/recipes'

const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v])

export function FilterBar({ query, onQuery }: { query?: string; onQuery?: (q: string) => void }) {
  const { f, set, clear } = useFilters()
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b-4 border-line/60 mx-0">
        <button onClick={() => setOpen(true)} className="shrink-0 rounded-full bg-brand text-white text-[13px] px-3 py-1">☰ Filters</button>
        {query && <Chip onRemove={() => onQuery?.('')}>{query}</Chip>}
        {f.avoid.map((a) => <Chip key={a} active onRemove={() => set({ ...f, avoid: toggle(f.avoid, a) })}>No {a.toLowerCase()}</Chip>)}
        {[...f.diet, ...f.meal, ...f.cats].map((c) => <Chip key={c} active>{c}</Chip>)}
        <button onClick={clear} className="shrink-0 rounded-full border border-brand/40 text-brand text-[13px] px-3 py-1">↺ Clear filters</button>
      </div>
      {open && <FiltersSheet onClose={() => setOpen(false)} query={query} onQuery={onQuery} />}
    </>
  )
}

function FiltersSheet({ onClose, query, onQuery }: { onClose: () => void; query?: string; onQuery?: (q: string) => void }) {
  const { f, set } = useFilters()
  const [d, setD] = useState<Filters>(f)
  const Group = ({ label, items, k }: { label: string; items: string[]; k: 'diet' | 'meal' | 'avoid' | 'cats' }) => (
    <section className="mt-4"><h3 className="text-[15px] mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">{items.map((i) => <Chip key={i} active={d[k].includes(i)} onClick={() => setD({ ...d, [k]: toggle(d[k], i) })}>{i}</Chip>)}</div>
    </section>
  )
  return (
    <Sheet title="Recipe search" onClose={onClose} footer={
      <div className="flex gap-3">
        <button className="flex-1 border border-line rounded-full py-2 text-muted" onClick={() => setD(DEFAULT_FILTERS)}>Reset</button>
        <button className="flex-1 bg-brand text-white rounded-full py-2 font-semibold" onClick={() => { set(d); onClose() }}>Apply filters</button>
      </div>}>
      <input value={query ?? ''} onChange={(e) => onQuery?.(e.target.value)} placeholder="Search by ingredient, recipe name…" className="w-full border border-line rounded-md px-3 py-2" />
      <section className="mt-4"><h3 className="text-[15px] mb-2">Sort by</h3>
        <div className="flex flex-wrap gap-2">{['Relevance', 'Latest', 'Fewest ingredients', 'Highest rated'].map((s) => <Chip key={s} active={d.sort === s} onClick={() => setD({ ...d, sort: s })}>{s}</Chip>)}</div>
      </section>
      <Group label="Dietary requirements" items={diets} k="diet" />
      <Group label="Meal types" items={mealTypes} k="meal" />
      <Group label="Exclude allergens" items={allergens} k="avoid" />
      <Group label="Useful categories" items={categories} k="cats" />
    </Sheet>
  )
}
