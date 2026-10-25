import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { recipes, type Recipe } from '../data/recipes'
import { amount, detailFor } from '../data/recipeDetail'
import { recipeStats } from '../data/progress'
import { MEALS, slotKey, type Plan } from '../data/plans'
import { Photo, Sheet } from '../components/ui'
import { useSaved } from '../lib/saved'
import { usePlans } from '../lib/plans'
import { addDays, todayIso, weekday } from '../lib/dates'

type Modal = null | 'share' | 'plan' | 'save' | 'chat'
type Tab = 'Overview' | 'Ingredients' | 'Method'

export default function RecipeDetail() {
  const { slug } = useParams(); const nav = useNavigate()
  const r = recipes.find((x) => x.slug === slug)
  const [tab, setTab] = useState<Tab>('Overview')
  const [modal, setModal] = useState<Modal>(null)
  const [more, setMore] = useState(false)
  const [ask, setAsk] = useState('')
  const saved = useSaved().collections.some((c) => c.slugs.includes(slug ?? ''))
  if (!r) return <p className="p-4">Recipe not found.</p>
  const d = detailFor(r)
  const chat = (q = '') => { setAsk(q); setModal('chat') }
  return (
    <div className="pb-8">
      <div className="relative">
        <Photo hue={r.hue} className="h-[300px]" />
        <button aria-label="Back" onClick={() => nav(-1)} className="absolute top-2 left-2 w-11 h-11 text-white text-[28px] drop-shadow">←</button>
      </div>

      <div className="px-4 mt-3 flex items-center justify-between">
        <span className="text-brand font-bold text-[15px] uppercase">{r.mainIngredient}{r.rating && <span className="text-muted font-normal normal-case ml-2"><span className="text-amber-500">★</span> {r.rating}</span>}</span>
        <div className="flex items-center text-brand text-[20px]">
          <button aria-label="Share" onClick={() => setModal('share')} className="w-10 h-10">↪</button>
          {/* Print: not captured in the audit; opens the browser's print dialog */}
          <button aria-label="Print" onClick={() => window.print()} className="w-10 h-10">⎙</button>
          <button aria-label="Add to meal plan" onClick={() => setModal('plan')} className="w-10 h-10">▦</button>
          <button aria-label={saved ? 'Saved' : 'Save'} onClick={() => setModal('save')} className="w-10 h-10 text-[#e57373]">{saved ? '♥' : '♡'}</button>
        </div>
      </div>
      <h1 className="px-4 text-[26px] font-semibold leading-tight mt-1">{r.title}</h1>
      <p className={`px-4 mt-2 text-[17px] leading-relaxed text-muted ${more ? '' : 'line-clamp-3'}`}>{d.description}</p>
      <button onClick={() => setMore(!more)} className="px-4 text-[17px] text-muted">{more ? 'Read less ⌃' : 'Read more ⌄'}</button>

      <div className="mt-3 bg-[#faf6f0] flex justify-center py-1.5">
        {(['Overview', 'Ingredients', 'Method'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-3.5 py-2 text-[15px] font-bold uppercase tracking-wide ${tab === t ? 'bg-brand text-white' : 'text-muted'}`}>{t}</button>
        ))}
      </div>

      <ChatCard onAsk={chat} />

      {tab === 'Overview' && <Overview r={r} d={d} />}
      {tab === 'Ingredients' && <Ingredients d={d} />}
      {tab === 'Method' && <Method slug={r.slug} d={d} />}

      {modal === 'share' && <ShareSheet onClose={() => setModal(null)} />}
      {modal === 'plan' && <AddToPlanSheet slug={r.slug} onClose={() => setModal(null)} />}
      {modal === 'save' && <SaveSheet slug={r.slug} onClose={() => setModal(null)} />}
      {modal === 'chat' && <ChatSheet title={r.title} initial={ask} onClose={() => setModal(null)} />}
    </div>
  )
}

// Green "Chat with Dr Rupy" card shown above every pane. The box, the Chat button and the chips all open the chat sheet.
function ChatCard({ onAsk }: { onAsk: (q?: string) => void }) {
  return (
    <div className="mx-4 mt-4 rounded-lg p-2.5 pb-3" style={{ background: 'linear-gradient(115deg, #8cc63f 0 32%, #12a676 32%)' }}>
      <div className="flex items-center gap-2">
        <span className="shrink-0 w-[52px] h-[52px] rounded-full bg-white border-2 border-white grid place-items-center text-3xl">🧑🏽‍🍳</span>
        <button onClick={() => onAsk()} className="flex-1 min-w-0 flex bg-white rounded-lg overflow-hidden text-left">
          <span className="flex-1 min-w-0 truncate px-3 py-2.5 text-muted text-[16px]">Chat with Dr Rupy about this recipe</span>
          <span className="shrink-0 bg-black text-white font-bold px-3 grid place-items-center">Chat</span>
        </button>
      </div>
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {['Make veggie', 'Swap ingredients', 'Why is this healthy?'].map((q) => (
          <button key={q} onClick={() => onAsk(q)} className="shrink-0 bg-[#faf6f0] rounded-full px-3 py-1.5 text-[15px]">{q}</button>
        ))}
      </div>
    </div>
  )
}

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div><div className="text-muted text-[14px] uppercase tracking-wide">{label}</div><div className="text-[16px] mt-0.5">{value}</div></div>
)

// Only the top of the Overview pane was captured (01_overview); the rows below Shelf life are a best guess.
function Overview({ r, d }: { r: Recipe; d: ReturnType<typeof detailFor> }) {
  const s = recipeStats[r.slug]
  return (
    <div className="px-4 mt-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Fact label="Prep time" value={`${d.prep} mins`} /><Fact label="Cook time" value={`${d.cook} mins`} />
        <Fact label="Freezer friendly" value={d.freezer ? 'Yes' : 'No'} /><Fact label="Shelf life" value={d.shelf} />
        {s && <><Fact label="Protein" value={`${s.protein}g per serving`} /><Fact label="Fibre" value={`${s.fibre}g per serving`} /></>}
      </div>
      {[...r.diet, ...r.categories].length > 0 && <div className="flex flex-wrap gap-2 mt-5">
        {[...r.diet, ...r.categories].map((t) => <span key={t} className="bg-brand-soft text-brand rounded-full px-3 py-1 text-[14px]">{t}</span>)}
      </div>}
    </div>
  )
}

function Ingredients({ d }: { d: ReturnType<typeof detailFor> }) {
  const [serves, setServes] = useState(2)
  const [imperial, setImperial] = useState(false)
  const round = 'w-6 h-6 rounded-full border-2 border-brand text-brand grid place-items-center leading-none text-sm'
  return (
    <div className="px-4 mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[18px]">
          <button aria-label="Fewer servings" onClick={() => setServes(Math.max(1, serves - 1))} className={round}>−</button>
          <span>Serves {serves}</span>
          <button aria-label="More servings" onClick={() => setServes(Math.min(12, serves + 1))} className={round}>+</button>
        </div>
        <div className="flex border border-brand/40 rounded-full text-[17px] overflow-hidden">
          {['Metric', 'Imperial'].map((u) => (
            <button key={u} onClick={() => setImperial(u === 'Imperial')}
              className={`px-3 py-0.5 rounded-full ${(u === 'Imperial') === imperial ? 'bg-brand text-white' : 'text-brand'}`}>{u}</button>
          ))}
        </div>
      </div>
      {d.groups.filter((g) => g.lines.length).map((g) => (
        <section key={g.title} className="mt-5">
          <h3 className="text-brand text-[14px] uppercase tracking-wide">{g.title}</h3>
          <ul className="mt-1 divide-y divide-line/60">
            {g.lines.map((l) => (
              <li key={l.name} className="flex gap-3 py-2 text-[17px]">
                <span className="w-[80px] shrink-0 text-right text-muted">{amount(l, serves, imperial)}</span>
                <span className="text-brand">{l.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

// "Your notes" are kept per recipe in this browser's localStorage ("dk-notes").
const NOTES_KEY = 'dk-notes'
const readNotes = (): Record<string, string> => { try { return JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}') } catch { return {} } }

function Method({ slug, d }: { slug: string; d: ReturnType<typeof detailFor> }) {
  const [note, setNote] = useState(() => readNotes()[slug] ?? '')
  const [editing, setEditing] = useState(false)
  const save = () => { try { localStorage.setItem(NOTES_KEY, JSON.stringify({ ...readNotes(), [slug]: note.trim() })) } catch { /* private mode */ } setEditing(false) }
  return (
    <div className="px-4 mt-5">
      <div className="px-2 pb-4 border-b border-line">
        <button onClick={() => setEditing(true)} className="text-muted text-[14px] uppercase tracking-wide">Your notes ✎</button>
        {editing
          ? <div className="mt-2">
              <textarea autoFocus value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full border border-line rounded-md px-3 py-2 text-[16px]" />
              <button onClick={save} className="mt-1 bg-brand text-white rounded-lg px-5 py-1.5">Save note</button>
            </div>
          : note && <p className="mt-1 text-[16px] whitespace-pre-line">{note}</p>}
      </div>
      <ol className="mt-4 space-y-4 text-[18px] leading-relaxed">
        {d.steps.map((s, i) => <li key={i}>{i + 1}. {s}</li>)}
      </ol>
    </div>
  )
}

// UX issue Recipe detail !1: a Save button on a share sheet is ambiguous (it just closes), and there is no copy-link option.
// The three share targets leave the app, so they are inert here.
function ShareSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="Share this recipe 😌" onClose={onClose}>
      <div className="grid grid-cols-3 gap-1">
        {[['🟢', 'Whatsapp'], ['🔵', 'Facebook'], ['✉️', 'Email']].map(([i, n]) => (
          <span key={n} className="border border-brand rounded-lg py-2 text-center text-brand text-[17px]"><div className="text-[13px]">{i}</div>{n}</span>
        ))}
      </div>
      <div className="text-center mt-6"><button onClick={onClose} className="bg-brand text-white rounded-lg px-14 py-2 text-[17px]">Save</button></div>
    </Sheet>
  )
}

// UX issue Recipe detail !2: with no current plan it says you have no plans at all, even when previous plans exist;
// only a small "here" link leads on, and Save shows with nothing to save.
// With a current plan the sheet lets you pick a day and meal (that state was not captured; best guess).
function AddToPlanSheet({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { plans, update } = usePlans()
  const today = todayIso()
  const current = plans.filter((p) => addDays(p.start, p.days - 1) >= today).sort((a, b) => a.start.localeCompare(b.start))
  const [planId, setPlanId] = useState(current[0]?.id ?? '')
  const plan = current.find((p) => p.id === planId)
  const [day, setDay] = useState(0)
  const [meal, setMeal] = useState(plan?.meals.includes('Dinner') ? 'Dinner' : plan?.meals[0] ?? 'Dinner')
  const save = () => {
    if (plan) update(plan.id, (p: Plan) => ({ ...p, slots: { ...p.slots, [slotKey(day, meal)]: [...(p.slots[slotKey(day, meal)] ?? []), { slug }] } }))
    onClose()
  }
  const select = 'w-full border border-line rounded-md px-3 py-2 bg-white text-[17px]'
  return (
    <Sheet title="Add recipe to a meal plan" onClose={onClose}>
      {!plan
        ? <div className="bg-[#d5ecf1] text-[#1d5f77] rounded px-4 py-3 text-[17px]">It looks like you haven't created any meal plans yet - you can do that <Link to="/plan" className="text-brand">here</Link></div>
        : <div className="space-y-3">
            {current.length > 1 && <select value={planId} onChange={(e) => setPlanId(e.target.value)} className={select}>{current.map((p) => <option key={p.id} value={p.id}>Plan starting {weekday(p.start)} {p.start.slice(8)}</option>)}</select>}
            <select value={day} onChange={(e) => setDay(Number(e.target.value))} className={select}>
              {Array.from({ length: plan.days }, (_, i) => <option key={i} value={i}>{weekday(addDays(plan.start, i))}</option>)}
            </select>
            <select value={meal} onChange={(e) => setMeal(e.target.value)} className={select}>
              {MEALS.filter((m) => plan.meals.includes(m)).map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>}
      <div className="text-center mt-6"><button onClick={save} className="bg-brand text-white rounded-lg px-14 py-2 text-[17px]">Save</button></div>
    </Sheet>
  )
}

// Replies were not captured in the audit, so a sent question gets a placeholder answer.
function ChatSheet({ title, initial, onClose }: { title: string; initial: string; onClose: () => void }) {
  const [q, setQ] = useState(initial)
  const [thread, setThread] = useState<string[]>([])
  const send = () => { if (q.trim()) { setThread([...thread, q.trim()]); setQ('') } }
  return (
    <Sheet title={`Ask Dr Rupy: ${title}`} onClose={onClose}>
      {thread.map((t, i) => (
        <div key={i} className="mb-3">
          <p className="ml-auto w-fit max-w-[85%] bg-brand-soft rounded-lg px-3 py-2">{t}</p>
          <p className="mt-2 w-fit max-w-[85%] bg-[#f1f1f1] rounded-lg px-3 py-2 text-muted italic">Dr Rupy's answer would appear here (not part of the prototype).</p>
        </div>
      ))}
      <form className="flex" onSubmit={(e) => { e.preventDefault(); send() }}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 min-w-0 border border-line rounded-l-md px-3 py-2.5 text-[17px]" />
        <button aria-label="Send" className="shrink-0 bg-brand text-white px-4 rounded-r-md text-xl">➤</button>
      </form>
      <p className="text-center text-[12px] text-muted mt-2">By using this service, you understand that it's an experimental feature and should not be construed as medical advice or diagnosis.</p>
    </Sheet>
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
