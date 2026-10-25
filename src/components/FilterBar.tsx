import { useState } from 'react'
import { useFilters, NO_FILTERS, type Filters } from '../lib/filters'
import { Chip, Icon, Sheet } from './ui'
import { useImproved } from '../lib/version'
import { allergens, categories, diets, mealTypes } from '../data/recipes'

const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v])

export function FilterBar({ query, onQuery }: { query?: string; onQuery?: (q: string) => void }) {
  const { f, set, clear } = useFilters()
  const [open, setOpen] = useState(false)
  // IMPROVED (UX issue U4): the Filters button shows how many filters are on; the sort order is not counted.
  const n = useImproved() ? f.avoid.length + f.diet.length + f.meal.length + f.cats.length : 0
  return (
    <>
      <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b-4 border-line/60 mx-0">
        <button onClick={() => setOpen(true)} className="shrink-0 inline-flex items-center gap-1 rounded-full bg-brand text-white text-[13px] px-3 py-1"><Icon name="tune" size={16} />Filters{n ? ` (${n})` : ''}</button>
        {query && <Chip onRemove={() => onQuery?.('')}>{query}</Chip>}
        {f.avoid.map((a) => <Chip key={a} active onRemove={() => set({ ...f, avoid: toggle(f.avoid, a) })}>No {a.toLowerCase()}</Chip>)}
        {[...f.diet, ...f.meal, ...f.cats].map((c) => <Chip key={c} active>{c}</Chip>)}
        <button onClick={clear} className="shrink-0 inline-flex items-center gap-1 rounded-full border border-brand/40 text-brand text-[13px] px-3 py-1"><Icon name="restart_alt" size={16} />Clear filters</button>
      </div>
      {open && <FiltersSheet onClose={() => setOpen(false)} query={query} onQuery={onQuery} />}
    </>
  )
}

// Selected options in the sheet are solid blue (09_filters-modal), unlike the light blue applied chips in the bar.
const Option = ({ children, on, onClick }: { children: string; on: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`rounded-full border px-3 py-0.5 text-[15px] ${on ? 'bg-[#6b8fdc] border-[#6b8fdc] text-white' : 'border-line text-ink bg-white'}`}>{children}</button>
)

// "Recipe search" sheet, opened by the Filters button and by the search field on Recipes home.
// The query is applied with the filters when Apply filters (or Enter in the search box) is pressed.
export function FiltersSheet({ onClose, query, onQuery, focus }: { onClose: () => void; query?: string; onQuery?: (q: string) => void; focus?: boolean }) {
  const { f, set } = useFilters()
  const [d, setD] = useState<Filters>(f)
  const [q, setQ] = useState(query ?? '')
  const apply = () => { set(d); onQuery?.(q.trim()); onClose() }
  const Group = ({ label, items, k }: { label: string; items: string[]; k: 'diet' | 'meal' | 'avoid' | 'cats' }) => (
    <section className="mt-4"><h3 className="text-[17px] mb-1.5">{label}</h3>
      <div className="flex flex-wrap gap-1.5">{items.map((i) => <Option key={i} on={d[k].includes(i)} onClick={() => setD({ ...d, [k]: toggle(d[k], i) })}>{i}</Option>)}</div>
    </section>
  )
  return (
    <Sheet title="Recipe search" onClose={onClose} footer={
      <div className="flex justify-around">
        <button className="border border-muted/60 rounded-lg px-8 py-2 text-muted text-[17px]" onClick={() => setD(NO_FILTERS)}>Reset</button>
        <button className="bg-brand text-white rounded-lg px-7 py-2 text-[17px]" onClick={apply}>Apply filters</button>
      </div>}>
      {/* Hidden where the search has its own field (Recipe search results in the improved version) */}
      {onQuery && <form onSubmit={(e) => { e.preventDefault(); apply() }} className="relative">
        <Icon name="search" size={22} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
        <input autoFocus={focus} value={q} onChange={(e) => setQ(e.target.value)} enterKeyHint="search" placeholder="Search by ingredient, recipe name…" className="w-full border border-line rounded-md pl-9 pr-3 py-2 text-[17px]" />
      </form>}
      <section className="mt-4"><h3 className="text-[17px] mb-1.5">Sort by</h3>
        <div className="flex flex-wrap gap-1.5">{['Relevance', 'Latest', 'Fewest ingredients', 'Highest rated'].map((s) => <Option key={s} on={d.sort === s} onClick={() => setD({ ...d, sort: s })}>{s}</Option>)}</div>
      </section>
      <Group label="Dietary requirements" items={diets} k="diet" />
      <Group label="Meal types" items={mealTypes} k="meal" />
      <Group label="Exclude allergens" items={allergens} k="avoid" />
      <Group label="Useful categories" items={categories} k="cats" />
    </Sheet>
  )
}
