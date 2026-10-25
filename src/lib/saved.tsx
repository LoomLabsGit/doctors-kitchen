import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { initialCollections, initialCooked, initialRated, type Collection } from '../data/saved'

type SavedCtx = {
  collections: Collection[]; rated: Record<string, number>; cooked: string[]
  create: (name: string, slugs?: string[]) => void
  rename: (id: string, name: string) => void
  remove: (id: string) => void
  setMembership: (slug: string, ids: string[]) => void
  removeRecipe: (id: string, slug: string) => void
}
const Ctx = createContext<SavedCtx>(null!)
export const useSaved = () => useContext(Ctx)

// Kept in this browser's localStorage, like plans. Clear the "dk-saved" key to get the mock collections back.
const KEY = 'dk-saved'
const load = (): Collection[] => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : initialCollections } catch { return initialCollections } }

export function SavedProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(collections)) } catch { /* private mode: in memory only */ } }, [collections])
  const map = (fn: (c: Collection) => Collection) => setCollections((cs) => cs.map(fn))
  return <Ctx.Provider value={{
    collections, rated: initialRated, cooked: initialCooked,
    create: (name, slugs = []) => setCollections((cs) => [...cs, { id: `c-${Date.now()}`, name, slugs }]),
    rename: (id, name) => map((c) => (c.id === id ? { ...c, name } : c)),
    remove: (id) => setCollections((cs) => cs.filter((c) => c.id !== id)),
    // Puts the recipe in exactly the given collections (the Save sheet's checkboxes).
    setMembership: (slug, ids) => map((c) => {
      const has = c.slugs.includes(slug), want = ids.includes(c.id)
      return has === want ? c : { ...c, slugs: want ? [...c.slugs, slug] : c.slugs.filter((s) => s !== slug) }
    }),
    removeRecipe: (id, slug) => map((c) => (c.id === id ? { ...c, slugs: c.slugs.filter((s) => s !== slug) } : c)),
  }}>{children}</Ctx.Provider>
}
