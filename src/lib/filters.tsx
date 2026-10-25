import { createContext, useContext, useState, type ReactNode } from 'react'
import { useImproved } from './version'

export type Filters = { sort: string; diet: string[]; meal: string[]; avoid: string[]; cats: string[] }
export const NO_FILTERS: Filters = { sort: 'Relevance', diet: [], meal: [], avoid: [], cats: [] }
// AS-IS BEHAVIOUR (UX issue Recipes !1): "No gluten" is applied by default and comes back on reload.
// IMPROVED: nothing is filtered by default.
export const defaultFilters = (improved: boolean): Filters => (improved ? NO_FILTERS : { ...NO_FILTERS, avoid: ['Gluten'] })

const Ctx = createContext<{ f: Filters; set: (f: Filters) => void; clear: () => void }>(null!)
export const useFilters = () => useContext(Ctx)
export function FiltersProvider({ children }: { children: ReactNode }) {
  const improved = useImproved()
  const [s, setS] = useState(() => ({ improved, f: defaultFilters(improved) }))
  // Switching version starts again from that version's defaults (adjusted during render, not in an effect).
  if (s.improved !== improved) setS({ improved, f: defaultFilters(improved) })
  const set = (f: Filters) => setS({ improved, f })
  return <Ctx.Provider value={{ f: s.f, set, clear: () => set(NO_FILTERS) }}>{children}</Ctx.Provider>
}
