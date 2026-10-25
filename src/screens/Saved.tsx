import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { Photo, RecipeRow, Sheet } from '../components/ui'
import { useSaved } from '../lib/saved'

const bySlug = Object.fromEntries(recipes.map((r) => [r.slug, r]))

// UX issue Saved !1: no way to create or manage collections here; new ones only come from a recipe's Save sheet.
export function SavedHome() {
  const { collections, rated, cooked } = useSaved()
  const lists = [
    ...collections.map((c) => ({ to: `/saved/${c.id}`, name: c.name, slugs: c.slugs })),
    { to: '/saved/rated', name: 'Your rated recipes', slugs: Object.keys(rated) },
    { to: '/saved/cooked', name: "Recipes you've cooked", slugs: cooked },
  ]
  return (
    <div className="pb-6">
      <h1 className="px-4 text-[26px] font-semibold">Your saved recipes</h1>
      <div className="mx-4 mt-2 divide-y divide-line/70">
        {lists.map((l) => (
          <Link key={l.to} to={l.to} className="block px-4 py-4">
            <div className="text-brand text-[22px]">{l.name} ›</div>
            {/* Shows the first five; no count of how many more (as-is) */}
            <div className="flex gap-2 mt-2">
              {l.slugs.slice(0, 5).map((s) => <Photo key={s} hue={bySlug[s]?.hue ?? 0} className="w-[50px] h-[50px] rounded-lg shrink-0" />)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function SavedCollection() {
  const { id } = useParams()
  const nav = useNavigate()
  const { collections, rename, remove, removeRecipe } = useSaved()
  const c = collections.find((x) => x.id === id)
  const [menu, setMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  if (!c) return <p className="p-4">Collection not found. <Link to="/saved" className="text-brand">Back to saved recipes</Link></p>
  // FIXED (UX issue Saved !3): Favourites, the default collection, cannot be deleted, and the warning for other
  // collections says what happens to their recipes. Before: any collection could go, with a vague confirm().
  const isDefault = c.id === 'favourites'
  return (
    <div className="pb-6">
      <div className="flex justify-between items-center px-4 relative">
        <h1 className="text-[26px] font-semibold">{c.name}</h1>
        <button onClick={() => setMenu(!menu)} className="rounded-lg bg-brand-soft text-brand px-5 py-1.5">Edit ▾</button>
        {menu && (
          <div className="absolute right-4 top-full mt-1 z-10 bg-white border border-line rounded-md shadow-md py-1 w-[160px] text-brand text-[17px]">
            {/* UX issue Saved !2: this menu stays open behind the Rename sheet */}
            <button onClick={() => setRenaming(true)} className="block w-full text-left px-4 py-2">✎ Rename</button>
            {isDefault
              ? <p className="px-4 py-2 text-[13px] text-muted">Favourites is your default collection, so it can't be deleted.</p>
              : <button onClick={() => { setMenu(false); setDeleting(true) }} className="block w-full text-left px-4 py-2">🗑 Delete</button>}
          </div>
        )}
      </div>
      <div className="mt-2">
        {c.slugs.length === 0 && <p className="px-4 text-muted">No recipes in this collection yet.</p>}
        {c.slugs.map((s) => bySlug[s] && (
          <RecipeRow key={s} r={bySlug[s]} corner={
            // Removes the recipe at once, no confirmation or undo (as-is)
            <button onClick={(e) => { e.preventDefault(); removeRecipe(c.id, s) }}
              className="absolute top-2 right-2 bg-[#e57373]/90 text-white text-[13px] rounded-full px-2 py-0.5">× Delete</button>
          } />
        ))}
      </div>
      {deleting && (
        <Sheet title={`Delete "${c.name}"?`} onClose={() => setDeleting(false)}>
          <p className="text-[16px]">This removes the collection. {c.slugs.length ? `Its ${c.slugs.length} recipe${c.slugs.length === 1 ? '' : 's'} stay in the app and in any other collections they're in.` : "It's empty."}</p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setDeleting(false)} className="flex-1 border border-line rounded-lg py-2.5 text-[17px]">Keep it</button>
            <button onClick={() => { remove(c.id); nav('/saved') }} className="flex-1 bg-[#d32f2f] text-white rounded-lg py-2.5 text-[17px]">Delete collection</button>
          </div>
        </Sheet>
      )}
      {renaming && <RenameSheet name={c.name} onSave={(n) => { rename(c.id, n); setRenaming(false) }} onClose={() => setRenaming(false)} />}
    </div>
  )
}

function RenameSheet({ name, onSave, onClose }: { name: string; onSave: (n: string) => void; onClose: () => void }) {
  const [v, setV] = useState(name)
  return (
    <Sheet title="Edit collection name" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); if (v.trim()) onSave(v.trim()) }}>
        <input autoFocus value={v} onChange={(e) => setV(e.target.value)} className="w-full border border-line rounded-md px-3 py-2" />
        <div className="text-center mt-4"><button className="bg-brand text-white rounded-lg px-8 py-2 text-[17px]">Save</button></div>
      </form>
    </Sheet>
  )
}

// The two fixed lists: no Edit menu and no Delete pill.
export function SavedFixed({ kind }: { kind: 'rated' | 'cooked' }) {
  const { rated, cooked } = useSaved()
  const slugs = kind === 'rated' ? Object.keys(rated) : cooked
  return (
    <div className="pb-6">
      <h1 className="px-4 text-[26px] font-semibold">{kind === 'rated' ? 'Your rated recipes' : "Recipes you've cooked"}</h1>
      <div className="mt-2">
        {/* Rated shows the user's own rating in place of the average */}
        {slugs.map((s) => bySlug[s] && <RecipeRow key={s} r={kind === 'rated' ? { ...bySlug[s], rating: rated[s] } : bySlug[s]} corner={null} />)}
      </div>
    </div>
  )
}
