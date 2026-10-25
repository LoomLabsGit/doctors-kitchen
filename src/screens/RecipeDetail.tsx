import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { Photo, Sheet } from '../components/ui'
import { useSaved } from '../lib/saved'

type Modal = null | 'share' | 'plan' | 'save' | 'chat'
export default function RecipeDetail() {
  const { slug } = useParams(); const nav = useNavigate()
  const r = recipes.find((x) => x.slug === slug)
  const [tab, setTab] = useState<'Ingredients' | 'Method'>('Ingredients')
  const [modal, setModal] = useState<Modal>(null)
  if (!r) return <p className="p-4">Recipe not found.</p>
  return (
    <div className="pb-6">
      <div className="relative"><Photo hue={r.hue} className="h-[260px]" />
        <button onClick={() => nav(-1)} className="absolute top-3 left-3 bg-white/90 rounded-full w-9 h-9">‹</button></div>
      <div className="px-4 mt-3">
        <h1 className="text-2xl font-semibold">{r.title}</h1>
        <div className="text-sm text-muted mt-1">◷ {r.mins} mins · ⌁ {r.ingredients} ingredients{r.rating && ` · ★ ${r.rating}`}</div>
        <div className="flex gap-6 mt-3 text-xl">
          <button onClick={() => setModal('save')}>♡</button><button onClick={() => setModal('plan')}>▦</button><button onClick={() => setModal('share')}>⇪</button>
        </div>
        <div className="flex mt-4 border-b border-line">
          {(['Ingredients', 'Method'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 ${tab === t ? 'border-b-2 border-brand text-brand font-semibold' : 'text-muted'}`}>{t}</button>))}
        </div>
        <p className="mt-4 text-muted text-sm">{tab} content goes here. TODO: port the real pane (see docs/screens/02_Recipe-detail).</p>
        <button onClick={() => setModal('chat')} className="mt-6 w-full border border-line rounded-full py-2 text-left px-4 text-muted">Ask about this recipe…</button>
      </div>
      {modal === 'share' && <Sheet title="Share" onClose={() => setModal(null)}><p>WhatsApp · Facebook · Email</p><button className="mt-3 bg-brand text-white rounded-full px-5 py-2">Save</button></Sheet>}
      {modal === 'plan' && <Sheet title="Add to plan" onClose={() => setModal(null)}><p>You do not have a current plan. Create one <u>here</u>.</p><button className="mt-3 bg-brand text-white rounded-full px-5 py-2">Save</button></Sheet>}
      {modal === 'save' && <SaveSheet slug={r.slug} onClose={() => setModal(null)} />}
      {modal === 'chat' && <Sheet title="Ask about this recipe" onClose={() => setModal(null)}><p className="text-muted">AI chat sheet, TODO.</p></Sheet>}
    </div>
  )
}

const hueOf = Object.fromEntries(recipes.map((x) => [x.slug, x.hue]))

// Save (heart): tick collections, or name a new one, then Save (02_Recipe-detail/07 and 08).
function SaveSheet({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { collections, setMembership, create } = useSaved()
  const [ids, setIds] = useState(collections.filter((c) => c.slugs.includes(slug)).map((c) => c.id))
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const save = () => { setMembership(slug, ids); if (name.trim()) create(name.trim(), [slug]); onClose() }
  return (
    <Sheet title="Add to a favourites collection" onClose={onClose}>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        {collections.map((c) => (
          <label key={c.id} className="block">
            <div className="grid grid-cols-2 aspect-square rounded-lg overflow-hidden border border-line">
              {c.slugs.slice(0, 4).map((s) => <Photo key={s} hue={hueOf[s] ?? 0} className="w-full h-full" />)}
            </div>
            <span className="flex items-center gap-2 mt-1 text-[17px]">
              <input type="checkbox" checked={ids.includes(c.id)} onChange={() => setIds(ids.includes(c.id) ? ids.filter((i) => i !== c.id) : [...ids, c.id])} />{c.name}
            </span>
          </label>
        ))}
      </div>
      <button onClick={() => setCreating(true)} className="mt-4 text-brand text-[17px]">⊕ Create new collection</button>
      {creating && <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter a name for your collection" className="mt-2 w-full border border-line rounded-md px-3 py-2" />}
      <div className="text-center mt-4"><button onClick={save} className="bg-brand text-white rounded-lg px-8 py-2 text-[17px]">Save</button></div>
    </Sheet>
  )
}
