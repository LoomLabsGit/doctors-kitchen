import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { AMOUNTS, INGREDIENTS, PLANT_TARGET, TARGETS, entryStats, guessItems, ingredient, shortTitle, yourRecipes, type Item, type LogEntry } from '../data/progress'
import { Photo, Sheet } from '../components/ui'
import { useProgress } from '../lib/progress'
import { addDays, ordinal, parseIso, todayIso } from '../lib/dates'

const bySlug = Object.fromEntries(recipes.map((r) => [r.slug, r]))
// AS-IS BEHAVIOUR (UX issue Progress !9): a described meal is still calculating after about a minute.
const CALC_MS = 60000
const TOAST_MS = 4000

const dayTitle = (d: string) => { const x = parseIso(d); return `${x.toLocaleDateString('en-GB', { weekday: 'short' })} ${ordinal(x.getDate())} ${x.toLocaleDateString('en-GB', { month: 'short' })}` }
const monday = (d: string) => addDays(d, -((parseIso(d).getDay() + 6) % 7))

function dayTotals(entries: LogEntry[]) {
  const stats = entries.map(entryStats).filter((x) => x !== null)
  return {
    fibre: stats.reduce((t, x) => t + x.fibre, 0), protein: stats.reduce((t, x) => t + x.protein, 0),
    plants: stats.reduce((t, x) => t + x.plants, 0), inflam: stats.length ? stats.reduce((t, x) => t + x.inflam, 0) / stats.length : null,
  }
}

export function ProgressHome() {
  const [sp, setSp] = useSearchParams()
  const loc = useLocation()
  const { log, add, remove } = useProgress()
  const d = sp.get('d') ?? todayIso()
  const setDay = (x: string) => setSp({ d: x })
  const [toast, setToast] = useState<string | undefined>((loc.state as { toast?: string } | null)?.toast)
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(undefined), TOAST_MS); return () => clearTimeout(t) }, [toast])
  const [adding, setAdding] = useState(false)
  const [info, setInfo] = useState<null | 'inflam' | 'plants'>(null)
  const [editing, setEditing] = useState<string | null>(null)

  const entries = log.filter((e) => e.date === d)
  const t = dayTotals(entries)
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday(d), i))
  const plants = dayTotals(log.filter((e) => week.includes(e.date))).plants
  const empty = entries.length === 0
  const say = (msg: string) => setToast(msg)
  const edited = log.find((e) => e.id === editing)

  return (
    <div className="pb-6">
      {toast && <div className="mx-4 mb-2 bg-brand-soft text-[#1b6b4f] rounded-md px-4 py-2 text-[17px]">{toast}</div>}
      <div className="flex items-center justify-between px-6">
        <button aria-label="Previous day" onClick={() => setDay(addDays(d, -1))} className="text-3xl leading-none">‹</button>
        <h1 className="text-[26px] font-semibold">{dayTitle(d)}</h1>
        <button aria-label="Next day" onClick={() => setDay(addDays(d, 1))} className="text-3xl leading-none">›</button>
      </div>

      <div className="grid grid-cols-7 px-4 mt-3">
        {week.map((w) => {
          const wt = dayTotals(log.filter((e) => e.date === w))
          return (
            <button key={w} onClick={() => setDay(w)} className="flex flex-col items-center gap-1">
              <span className={`w-6 h-6 grid place-items-center rounded-full text-[15px] ${w === d ? 'bg-brand text-white font-semibold' : ''}`}>{'MTWTFSS'[(parseIso(w).getDay() + 6) % 7]}</span>
              <Rings fibre={wt.fibre} protein={wt.protein} size={30} stroke={3} />
            </button>
          )
        })}
      </div>

      <div className="relative w-[220px] h-[220px] mx-auto mt-6">
        <Rings fibre={t.fibre} protein={t.protein} size={220} stroke={18} />
        {/* UX issue Progress !1: on an empty day this and the button under the list are two identical "Add meal" buttons */}
        <div className="absolute inset-0 grid place-items-center">
          {empty
            ? <button onClick={() => setAdding(true)} className="bg-brand text-white rounded-lg px-3 py-1.5 text-[17px]">+ Add meal</button>
            : <button aria-label="Add meal" onClick={() => setAdding(true)} className="bg-brand text-white rounded-full w-9 h-9 text-2xl leading-none">+</button>}
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-4 text-[17px]">
        <span><span className="text-[#3b82f6]">●</span> Fibre <span className="text-[13px]">({t.fibre}/{TARGETS.fibre}g)</span></span>
        <span><span className="text-[#f0b44c]">●</span> Protein <span className="text-[13px]">({t.protein}/{TARGETS.protein}g)</span></span>
      </div>

      <div className="px-10 mt-6">
        <InfoLabel onClick={() => setInfo('inflam')}>Inflammation score</InfoLabel>
        <div className={`relative h-8 rounded mt-2 ${t.inflam === null ? 'opacity-45' : ''}`} style={{ background: 'linear-gradient(90deg, #4caf50, #c2c12c 55%, #f5c400 94%, #e0533a)' }}>
          {t.inflam !== null && <span className="absolute top-0 bottom-0 grid place-items-center text-white text-[13px] font-bold -translate-x-1/2" style={{ left: `${Math.max(4, t.inflam * 100)}%` }}>▸◂</span>}
        </div>
        <InfoLabel onClick={() => setInfo('plants')} className="mt-10">Plant points this week</InfoLabel>
        <div className="relative h-8 rounded mt-2 bg-[#e8ebee] overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-[#8db51c]" style={{ width: `${Math.min(1, plants / PLANT_TARGET) * 100}%` }} />
          <span className="absolute inset-0 grid place-items-center text-[15px]">🌱 {plants}</span>
        </div>
      </div>

      <div className="mt-10">
        {entries.map((e) => <EntryRow key={e.id} e={e}
          onDelete={() => { remove(e.id); say('The recipe has been removed from that day') }}
          onEdit={() => setEditing(e.id)} />)}
      </div>
      <div className="text-center mt-6">
        <button onClick={() => setAdding(true)} className="border border-brand text-brand rounded-lg px-6 py-2 text-[19px]">+ Add meal</button>
      </div>

      {adding && <AddMealSheet date={d} onClose={() => setAdding(false)}
        onAdded={(e, msg) => { add(e); setAdding(false); say(msg) }} />}
      {info && <InfoSheet kind={info} onClose={() => setInfo(null)} />}
      {edited && <EditSheet e={edited} onClose={() => setEditing(null)}
        onDelete={() => { remove(edited.id); setEditing(null); say('The recipe has been removed from that day') }} />}
    </div>
  )
}

// Fibre on the outer ring, protein on the inner ring, each filling clockwise from the top towards its target.
function Rings({ fibre, protein, size, stroke }: { fibre: number; protein: number; size: number; stroke: number }) {
  const ring = (r: number, value: number, target: number, colour: string, track: string) => {
    const c = 2 * Math.PI * r, part = Math.min(1, value / target)
    return <>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      {part > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colour} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${part * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />}
    </>
  }
  const outer = size / 2 - stroke / 2, inner = outer - stroke * 1.15
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {ring(outer, fibre, TARGETS.fibre, '#3b82f6', '#eaf2fd')}
      {ring(inner, protein, TARGETS.protein, '#f0b44c', '#fdf6ec')}
    </svg>
  )
}

const InfoLabel = ({ children, onClick, className = '' }: { children: string; onClick: () => void; className?: string }) => (
  <button onClick={onClick} className={`block mx-auto font-semibold text-[16px] ${className}`}>{children} <span className="text-[13px] border border-ink rounded-full px-1">?</span></button>
)

// UX issue Progress !2: the main button says Save, next to the close cross, and nothing is saved.
function InfoSheet({ kind, onClose }: { kind: 'inflam' | 'plants'; onClose: () => void }) {
  return (
    <Sheet title={kind === 'inflam' ? 'Inflammation score' : 'Plant points'} onClose={onClose}>
      <p className="text-[17px] leading-relaxed">{kind === 'inflam'
        ? 'Meals with a low inflammation score are linked to better sleep and mood. Vegetables, fruit, whole grains, nuts, legumes, fish and olive oil help bring the score down. 🥦🍎'
        : 'Each different plant you eat this week earns a point: vegetables, fruit, whole grains, legumes, nuts, seeds, herbs and spices all count. Aim for 30 a week. 🌱'}</p>
      <div className="text-center mt-6"><button onClick={onClose} className="bg-brand text-white rounded-lg px-14 py-2 text-[17px]">Save</button></div>
    </Sheet>
  )
}

function EntryRow({ e, onDelete, onEdit }: { e: LogEntry; onDelete: () => void; onEdit: () => void }) {
  const r = e.slug ? bySlug[e.slug] : undefined
  const st = entryStats(e)
  return (
    <div className="flex gap-3 px-4 py-2 items-start">
      <div className="relative w-[150px] h-[150px] shrink-0 rounded-lg overflow-hidden">
        {r ? <Photo hue={r.hue} className="w-full h-full" />
          // UX issue Progress !6: the user's own meals get a generic icon, and their tab says Edit where DK recipes say Delete
          : <div className="w-full h-full bg-[#fdf6ee] grid place-items-center text-5xl">🥕🍎</div>}
        {r
          // UX issue Progress !5: a small red tab on the photo removes the entry at once, no confirmation or undo
          ? <button onClick={onDelete} className="absolute top-2 right-2 bg-[#e57373]/90 text-white text-[13px] rounded-full px-2 py-0.5">× Delete</button>
          : <button onClick={onEdit} className="absolute top-2 right-2 bg-brand text-white text-[13px] rounded-full px-2 py-0.5">✎ Edit</button>}
      </div>
      <div className="flex-1 pt-1 min-w-0">
        {r ? <Link to={`/recipe/${r.slug}`} className="block font-semibold leading-tight text-[17px]">{r.title}</Link>
          : <div className="font-semibold leading-tight text-[17px]">{e.name}</div>}
        {st ? <div className="text-[15px] mt-1">Fibre: {st.fibre}g • Protein: {st.protein}g</div>
          : <div className="text-[13px] text-muted italic mt-1">Calculating nutritional info…</div>}
      </div>
    </div>
  )
}

// UX issue Progress !3: four ways to log a meal in one sheet, each a different control.
function AddMealSheet({ date, onClose, onAdded }: { date: string; onClose: () => void; onAdded: (e: Omit<LogEntry, 'id'>, toast: string) => void }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [own, setOwn] = useState('')
  const [desc, setDesc] = useState('')
  const uploaded = (name: string, items: Item[]) => onAdded({ date, name, items, readyAt: Date.now() + CALC_MS },
    // UX issue Progress !8: says "uploaded" even for typed text, and gives no idea how long it takes
    "Meal successfully uploaded - we'll get to work on calculating the ingredients and nutritional information")
  const btn = 'shrink-0 bg-brand text-white px-6 rounded-r-md text-[17px]'
  return (
    <Sheet title="Add meal" onClose={onClose}>
      <h3 className="font-semibold text-[15px]">From our recipes</h3>
      {/* UX issue Progress !4: route A leaves Progress for the general recipe search, which does not say which day the meal goes to */}
      <form className="flex mt-2" onSubmit={(e) => { e.preventDefault(); nav(`/search?q=${encodeURIComponent(q)}&log=${date}`) }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ingredient, recipe name" className="flex-1 min-w-0 border border-line rounded-l-md px-3 py-2" />
        <button className={btn}>Search</button>
      </form>

      <h3 className="font-semibold text-[15px] mt-4">From your recipes</h3>
      <div className="flex mt-2">
        <RecipePicker value={own} onChange={setOwn} />
        <button className={btn} onClick={() => { const y = yourRecipes.find((x) => x.name === own); if (y) onAdded({ date, name: y.name, items: y.items }, 'The recipe has been added') }}>Add</button>
      </div>

      <h3 className="font-semibold text-[15px] mt-4">Create a new meal</h3>
      {/* Route C was not captured in the audit: treated like route D, with no ingredients guessed */}
      <label className="block w-fit mx-auto mt-2 border border-brand text-brand rounded-lg px-4 py-1.5 text-[17px] cursor-pointer">
        📷 Upload photo
        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.length) uploaded('Photo of a meal', []) }} />
      </label>
      <p className="text-center text-muted my-1">– or –</p>
      <form className="flex" onSubmit={(e) => { e.preventDefault(); if (desc.trim()) uploaded(shortTitle(desc), guessItems(desc)) }}>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe the meal" className="flex-1 min-w-0 border border-line rounded-l-md px-3 py-2" />
        <button className={btn}>Add</button>
      </form>
    </Sheet>
  )
}

// Dropdown with its own search box, opening upwards (05_Progress/12).
function RecipePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [f, setF] = useState('')
  const list = yourRecipes.filter((y) => y.name.toLowerCase().includes(f.toLowerCase()))
  return (
    <div className="relative flex-1 min-w-0">
      <button onClick={() => setOpen(!open)} className={`w-full h-full flex justify-between items-center border border-line rounded-l-md px-3 py-2 text-left ${value ? '' : 'text-muted'}`}>
        <span className="truncate">{value || 'Search for a recipe'}</span><span>⌄</span>
      </button>
      {open && (
        <div className="absolute bottom-full left-0 right-0 bg-white border border-line rounded-md shadow-md p-2 z-10">
          <input autoFocus value={f} onChange={(e) => setF(e.target.value)} className="w-full border border-line rounded px-2 py-1 mb-1" />
          {list.map((y) => <button key={y.name} onClick={() => { onChange(y.name); setOpen(false) }} className="block w-full text-left px-2 py-1.5 hover:bg-[#e8ebee]">{y.name}</button>)}
        </div>
      )}
    </div>
  )
}

// UX issue Progress !7: the only way to remove the meal is the small grey link under Save.
function EditSheet({ e, onClose, onDelete }: { e: LogEntry; onClose: () => void; onDelete: () => void }) {
  const { update } = useProgress()
  const [name, setName] = useState(e.name ?? '')
  const [items, setItems] = useState<Item[]>(e.items ?? [])
  const set = (i: number, it: Item) => setItems(items.map((x, j) => (j === i ? it : x)))
  const step = (i: number, by: number) => {
    const opts = AMOUNTS[ingredient(items[i].name).unit], k = opts.indexOf(items[i].qty)
    set(i, { ...items[i], qty: opts[Math.min(opts.length - 1, Math.max(0, k + by))] })
  }
  const round = 'w-6 h-6 rounded-full border-2 grid place-items-center text-sm leading-none shrink-0'
  return (
    <Sheet title="Edit recipe" onClose={onClose}>
      <input value={name} onChange={(ev) => setName(ev.target.value)} className="w-full border border-line rounded-md px-3 py-2 text-[17px]" />
      <div className="mt-3 space-y-3">
        {items.map((it, i) => {
          const unit = ingredient(it.name).unit
          return (
            <div key={i} className="flex items-center gap-1.5">
              <button aria-label="Remove ingredient" onClick={() => setItems(items.filter((_, j) => j !== i))} className={`${round} border-[#e57373] text-[#e57373]`}>−</button>
              <select value={it.name} onChange={(ev) => { const u = ingredient(ev.target.value).unit; set(i, { name: ev.target.value, qty: u === unit ? it.qty : AMOUNTS[u][1] }) }}
                className="flex-1 min-w-0 border border-line rounded-md px-2 py-2 bg-white">
                {INGREDIENTS.map((x) => <option key={x.name}>{x.name}</option>)}
              </select>
              <button aria-label="Less" onClick={() => step(i, -1)} className={`${round} border-brand text-brand`}>−</button>
              <select value={it.qty} onChange={(ev) => set(i, { ...it, qty: Number(ev.target.value) })} className="w-[92px] border border-line rounded-md px-1 py-2 bg-white">
                {AMOUNTS[unit].map((a) => <option key={a} value={a}>{a} {unit}</option>)}
              </select>
              <button aria-label="More" onClick={() => step(i, 1)} className={`${round} border-brand text-brand`}>+</button>
            </div>
          )
        })}
      </div>
      <button onClick={() => setItems([...items, { name: INGREDIENTS[0].name, qty: AMOUNTS[INGREDIENTS[0].unit][1] }])} className="mt-4 text-brand text-[15px]">⊕ Add ingredient</button>
      <div className="text-center mt-4"><button onClick={() => { update(e.id, (x) => ({ ...x, name: name.trim() || x.name, items })); onClose() }} className="bg-brand text-white rounded-lg px-14 py-2 text-[17px]">Save</button></div>
      <div className="text-center mt-3"><button onClick={onDelete} className="text-[13px] text-muted">Delete recipe from this day</button></div>
    </Sheet>
  )
}
