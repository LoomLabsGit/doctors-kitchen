import { createContext, useContext, useState, type ReactNode } from 'react'

export type Filters = { sort: string; diet: string[]; meal: string[]; avoid: string[]; cats: string[] }
// AS-IS BEHAVIOUR (UX issue Recipes !1): "No gluten" is applied by default and comes back on reload.
// Kept so the redesign can be compared against it. Set to [] to fix.
export const DEFAULT_FILTERS: Filters = { sort: 'Relevance', diet: [], meal: [], avoid: ['Gluten'], cats: [] }

const Ctx = createContext<{ f: Filters; set: (f: Filters) => void; clear: () => void }>(null!)
export const useFilters = () => useContext(Ctx)
export function FiltersProvider({ children }: { children: ReactNode }) {
  const [f, set] = useState<Filters>(DEFAULT_FILTERS)
  return <Ctx.Provider value={{ f, set, clear: () => set({ ...DEFAULT_FILTERS, avoid: [] }) }}>{children}</Ctx.Provider>
}
