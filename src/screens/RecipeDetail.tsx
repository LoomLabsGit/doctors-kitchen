import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { Photo, Sheet } from '../components/ui'

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
      {modal === 'save' && <Sheet title="Save to collection" onClose={() => setModal(null)}><p>Favourites</p><button className="mt-3 border border-brand text-brand rounded-full px-5 py-2">Create a collection</button></Sheet>}
      {modal === 'chat' && <Sheet title="Ask about this recipe" onClose={() => setModal(null)}><p className="text-muted">AI chat sheet, TODO.</p></Sheet>}
    </div>
  )
}
