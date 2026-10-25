import { createContext, useContext, useState, type ReactNode } from 'react'

export type Filters = { sort: string; diet: string[]; meal: string[]; avoid: string[]; cats: string[] }
// FIXED (UX issue Recipes !1): nothing is filtered by default. The live app applied "No gluten" on every load,
// even after "Clear filters"; to compare, set avoid back to ['Gluten'].
export const DEFAULT_FILTERS: Filters = { sort: 'Relevance', diet: [], meal: [], avoid: [], cats: [] }

const Ctx = createContext<{ f: Filters; set: (f: Filters) => void; clear: () => void }>(null!)
export const useFilters = () => useContext(Ctx)
export function FiltersProvider({ children }: { children: ReactNode }) {
  const [f, set] = useState<Filters>(DEFAULT_FILTERS)
  return <Ctx.Provider value={{ f, set, clear: () => set(DEFAULT_FILTERS) }}>{children}</Ctx.Provider>
}
