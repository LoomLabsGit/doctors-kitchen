import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { FOCUS, MEALS, fillSlots, ownRecipes, poolFor, shoppingList, slotKey, type Entry, type Plan } from '../data/plans'
import { Chip, Heart, Icon, Photo, Sheet } from '../components/ui'
import { usePlans } from '../lib/plans'
import { useSaved } from '../lib/saved'
import { addDays, dateRange, todayIso, weekday } from '../lib/dates'

const bySlug = Object.fromEntries(recipes.map((r) => [r.slug, r]))
const entries = (p: Plan) => p.meals.flatMap((m) => Array.from({ length: p.days }, (_, d) => p.slots[slotKey(d, m)] ?? [])).flat()
// AS-IS BEHAVIOUR (UX issue Plan !1): about 15 s with no cancel and no progress detail.
const BUILD_MS = 15000

export function PlanHome() {
  const { plans } = usePlans()
  const [creating, setCreating] = useState(false)
  const today = todayIso()
  const isCurrent = (p: Plan) => addDays(p.start, p.days - 1) >= today
  const current = plans.filter(isCurrent).sort((a, b) => a.start.localeCompare(b.start))
  const previous = plans.filter((p) => !isCurrent(p)).sort((a, b) => b.start.localeCompare(a.start))
  return (
    <div className="pb-6">
      <div className="flex justify-between items-center px-4">
        <h1 className="text-[26px] font-semibold whitespace-nowrap">Your meal plans</h1>
        <button onClick={() => setCreating(true)} className="shrink-0 whitespace-nowrap rounded-full bg-brand-soft text-brand px-4 py-1.5 text-[15px]">+ Create new plan</button>
      </div>
      {current.map((p) => <div key={p.id} className="px-4 mt-3"><PlanTile p={p} /></div>)}
      {previous.length > 0 && <>
        <h2 className="px-4 mt-5 text-lg font-semibold">Previous meal plans</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 mt-1">{previous.map((p) => <PlanTile key={p.id} p={p} />)}</div>
      </>}
      {creating && <PlanForm onClose={() => setCreating(false)} />}
    </div>
  )
}

function PlanTile({ p }: { p: Plan }) {
  return (
    <Link to={`/plan/${p.id}`} className="block min-w-0">
      <div className="text-brand text-[19px] truncate">{dateRange(p.start, p.days)}</div>
      {/* No recipe count; a third row is clipped mid-image (as-is) */}
      <div className="grid grid-cols-3 gap-1 max-w-[196px] max-h-[150px] overflow-hidden mt-1">
        {entries(p).map((e, i) => <Thumb key={i} e={e} className="aspect-square rounded-lg" />)}
      </div>
    </Link>
  )
}

const Thumb = ({ e, className }: { e: Entry; className: string }) =>
  'slug' in e ? <Photo hue={bySlug[e.slug]?.hue ?? 0} className={className} /> : <div className={`${className} bg-line grid place-items-center text-muted`}><Icon name="restaurant" size={32} /></div>

// Create and Update share this sheet. UX issue Plan !4: the Update version drops "AI plan?" and "Specific focus?",
// and Delete / Remove all are small text links.
function PlanForm({ plan, onClose }: { plan?: Plan; onClose: () => void }) {
  const nav = useNavigate()
  const { update, remove } = usePlans()
  const [start, setStart] = useState(plan?.start ?? todayIso())
  const [days, setDays] = useState(plan?.days ?? 5)
  const [servings, setServings] = useState(plan?.servings ?? 2)
  const [ai, setAi] = useState(true)
  const [focus, setFocus] = useState<string[]>([])
  const [meals, setMeals] = useState(plan?.meals ?? ['Breakfast', 'Lunch', 'Dinner'])
  const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v])
  const submit = () => {
    const ordered = MEALS.filter((m) => meals.includes(m))
    if (plan) { update(plan.id, (p) => ({ ...p, start, days, servings, meals: ordered })); onClose(); return }
    nav('/plan/building', { state: { start, days, servings, ai, focus, meals: ordered } })
  }
  return (
    <Sheet title={plan ? 'Update meal plan' : 'Create a new meal plan'} onClose={onClose}>
      <Row icon="calendar_month" label="Start date"><input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full border border-line rounded-md px-3 py-2" /></Row>
      <Row icon="date_range" label="Length"><Stepper value={days} set={setDays} min={1} max={7} unit="days" /></Row>
      <Row icon="person" label="Servings"><Stepper value={servings} set={setServings} min={1} max={8} unit="people" /></Row>
      {!plan && <>
        <Row icon="smart_toy" label="AI plan?">
          <input type="checkbox" checked={ai} onChange={(e) => setAi(e.target.checked)} className="w-4 h-4" />
          <p className="text-[13px] text-muted mt-2">This creates a personalised plan with recipes using your preferences</p>
        </Row>
        <Row icon="tune" label="Specific focus?">
          <div className="flex flex-wrap gap-1.5">{FOCUS.map((f) => <Chip key={f} active={focus.includes(f)} onClick={() => setFocus(toggle(focus, f))}>{f}</Chip>)}</div>
        </Row>
      </>}
      <Row icon="restaurant" label="Meals">
        {MEALS.map((m) => <label key={m} className="flex items-center gap-2 py-0.5"><input type="checkbox" checked={meals.includes(m)} onChange={() => setMeals(toggle(meals, m))} className="w-4 h-4" />{m}</label>)}
      </Row>
      <div className="text-center mt-5">
        <button onClick={submit} disabled={!meals.length} className="bg-brand text-white rounded-lg px-6 py-2.5 text-[17px] disabled:opacity-50">{plan ? 'Update meal plan' : 'Create meal plan'}</button>
      </div>
      {plan && <p className="text-center text-[13px] text-muted mt-4">
        <button onClick={() => { if (confirm('Are you sure you want to delete this meal plan?')) { remove(plan.id); nav('/plan') } }}>Delete meal plan</button>{' | '}
        <button onClick={() => { update(plan.id, (p) => ({ ...p, slots: {} })); onClose() }}>Remove all recipes</button>
      </p>}
    </Sheet>
  )
}

const Row = ({ icon, label, children }: { icon: string; label: string; children: ReactNode }) => (
  <div className="flex gap-3 py-3 text-[17px]">
    <div className="w-[128px] shrink-0 flex gap-2"><Icon name={icon} size={22} className="text-muted" />{label}</div>
    <div className="flex-1">{children}</div>
  </div>
)

const Stepper = ({ value, set, min, max, unit }: { value: number; set: (n: number) => void; min: number; max: number; unit: string }) => (
  <div className="flex items-center gap-3">
    <button aria-label={`Fewer ${unit}`} onClick={() => set(Math.max(min, value - 1))} className="text-brand grid place-items-center"><Icon name="do_not_disturb_on" size={24} /></button>
    <span>{value} {unit}</span>
    <button aria-label={`More ${unit}`} onClick={() => set(Math.min(max, value + 1))} className="text-brand grid place-items-center"><Icon name="add_circle" size={24} /></button>
  </div>
)

type BuildState = { start: string; days: number; servings: number; ai: boolean; focus: string[]; meals: string[] }
export function PlanBuilding() {
  const nav = useNavigate()
  const { add } = usePlans()
  const s = useLocation().state as BuildState | null
  useEffect(() => {
    if (!s) return
    const t = setTimeout(() => {
      const id = `plan-${Date.now()}`
      add({ id, start: s.start, days: s.days, servings: s.servings, meals: s.meals, slots: s.ai ? fillSlots(s.days, s.meals, s.focus) : {} })
      nav(`/plan/${id}`, { replace: true, state: { created: true } })
    }, s.ai ? BUILD_MS : 0)
    return () => clearTimeout(t)
    // Build once per visit; the form values arrive in navigation state and never change here.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!s) return <Navigate to="/plan" replace />
  return (
    <div className="flex flex-col items-center pt-24 px-8 text-center">
      <h1 className="text-[22px] font-bold">Building your personalised meal plan…</h1>
      <div className="relative w-[190px] h-[190px] mt-8">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#eee" strokeWidth="3" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="#f39c12" strokeWidth="3" pathLength="100" strokeDasharray="100"
            style={{ strokeDashoffset: 100, animation: `dk-fill ${BUILD_MS}ms linear forwards` }} />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-brand"><Icon name="rice_bowl" size={72} /></span>
      </div>
      <style>{'@keyframes dk-fill { to { stroke-dashoffset: 0 } }'}</style>
    </div>
  )
}

export function PlanDetail() {
  const { id } = useParams()
  const [created, setCreated] = useState(!!(useLocation().state as { created?: boolean } | null)?.created)
  const { plans } = usePlans()
  const plan = plans.find((p) => p.id === id)
  const [tab, setTab] = useState<'PLAN' | 'LIST'>('PLAN')
  const [editing, setEditing] = useState(false)
  if (!plan) return <p className="p-4">Meal plan not found. <Link to="/plan" className="text-brand">Back to meal plans</Link></p>
  return (
    <div className="pb-6">
      {/* The banner shows until the first tab change, as in 03_Plan/05 vs 06 */}
      {created && <div className="mx-4 mb-2 rounded-md bg-brand-soft border border-brand/20 text-[#0e7a57] px-4 py-3">Your meal plan was successfully created</div>}
      <div className="flex justify-between items-center px-4">
        <h1 className="text-[26px] font-semibold leading-tight">{dateRange(plan.start, plan.days)}</h1>
        <button onClick={() => setEditing(true)} className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-brand-soft text-brand px-4 py-1.5"><Icon name="edit" size={18} />Edit</button>
      </div>
      <div className="flex justify-center gap-1 mt-3 mx-4 border-b border-chip">
        {(['PLAN', 'LIST'] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setCreated(false) }}
            className={`rounded-t-lg border border-b-0 px-5 py-2 text-[17px] ${tab === t ? 'bg-brand border-brand text-white' : 'border-line text-brand'}`}>
            <Icon name={t === 'PLAN' ? 'calendar_month' : 'shopping_cart'} size={20} /> {t}
          </button>))}
      </div>
      {tab === 'PLAN' ? <PlanTab plan={plan} /> : <ListTab />}
      {editing && <PlanForm plan={plan} onClose={() => setEditing(false)} />}
    </div>
  )
}

function PlanTab({ plan }: { plan: Plan }) {
  const { update } = usePlans()
  const [closed, setClosed] = useState<number[]>([])
  const [adding, setAdding] = useState<{ day: number; meal: string } | null>(null)
  const setSlot = (day: number, meal: string, fn: (es: Entry[]) => Entry[]) =>
    update(plan.id, (p) => ({ ...p, slots: { ...p.slots, [slotKey(day, meal)]: fn(p.slots[slotKey(day, meal)] ?? []) } }))
  // AS-IS BEHAVIOUR (UX issue Plan !2): Swap replaces the meal at once with the next suggestion; no picker, confirmation or undo.
  const swap = (day: number, meal: string, i: number) => setSlot(day, meal, (es) => {
    const pool = poolFor(meal), cur = es[i]
    const at = 'slug' in cur ? pool.findIndex((r) => r.slug === cur.slug) : -1
    return es.map((e, j) => (j === i ? { slug: pool[(at + 1) % pool.length].slug } : e))
  })
  return (
    <div className="mt-2">
      {Array.from({ length: plan.days }, (_, day) => {
        const open = !closed.includes(day)
        return (
          <section key={day} className="border-b-4 border-line/70 pb-2">
            <div className="flex items-center gap-2 px-4 pt-3">
              <button onClick={() => setClosed(open ? [...closed, day] : closed.filter((d) => d !== day))} className="text-[20px] font-semibold">
                <span className={`inline-block mr-2 text-sm transition-transform ${open ? '' : '-rotate-90'}`}>▼</span>{weekday(addDays(plan.start, day))}
              </button>
              {/* Day pencil: what it opens was not captured in the audit */}
              <Icon name="edit" size={20} className="text-brand" />
            </div>
            {/* UX issue Plan !2: each day scrolls sideways, so Dinner and Snack sit off-screen */}
            {open && <div className="flex gap-6 overflow-x-auto px-4 pb-2 mt-1">
              {plan.meals.map((meal) => (
                <div key={meal} className="shrink-0">
                  <div className="font-semibold text-[17px] mb-1">{meal} <span className="font-normal text-[15px] inline-flex items-center"><Icon name="person" size={18} />{plan.servings}</span></div>
                  <div className="flex gap-3 items-center">
                    {(plan.slots[slotKey(day, meal)] ?? []).map((e, i) => (
                      <MealCard key={i} e={e} onDelete={() => setSlot(day, meal, (es) => es.filter((_, j) => j !== i))} onSwap={() => swap(day, meal, i)} />
                    ))}
                    <button onClick={() => setAdding({ day, meal })} className="shrink-0 inline-flex items-center border border-line rounded-lg pl-2 pr-3 py-1.5 text-brand"><Icon name="add" size={20} />Add</button>
                  </div>
                </div>
              ))}
            </div>}
          </section>
        )
      })}
      {adding && <AddMealSheet title={`Add to ${weekday(addDays(plan.start, adding.day))}'s ${adding.meal.toLowerCase()}`} meal={adding.meal}
        onAdd={(e) => { setSlot(adding.day, adding.meal, (es) => [...es, e]); setAdding(null) }} onClose={() => setAdding(null)} />}
    </div>
  )
}

function MealCard({ e, onDelete, onSwap }: { e: Entry; onDelete: () => void; onSwap: () => void }) {
  const title = 'slug' in e ? bySlug[e.slug]?.title : e.own
  const img = <Thumb e={e} className="w-[188px] h-[180px] rounded-lg" />
  return (
    <div className="w-[188px] shrink-0">
      <div className="relative">
        {'slug' in e ? <Link to={`/recipe/${e.slug}`}>{img}</Link> : img}
        {/* Delete removes the meal at once (as-is) */}
        <button onClick={onDelete} className="absolute top-2 right-2 inline-flex items-center bg-[#e57373]/90 text-white text-[13px] rounded-full pl-1 pr-2 py-0.5"><Icon name="close" size={16} />Delete</button>
        {'slug' in e && <button onClick={onSwap} className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 bg-black/60 text-white text-[13px] rounded-full pl-1.5 pr-2 py-0.5"><Icon name="swap_horiz" size={16} />Swap</button>}
      </div>
      <div className="text-[15px] leading-snug mt-1 line-clamp-2">{title}</div>
    </div>
  )
}

// UX issue Plan !3: three input styles in one sheet (suggestion cards, search box + button, own-recipe dropdown).
function AddMealSheet({ title, meal, onAdd, onClose }: { title: string; meal: string; onAdd: (e: Entry) => void; onClose: () => void }) {
  const [tab, setTab] = useState<'SEARCH' | 'FAVOURITES'>('SEARCH')
  const [q, setQ] = useState('')
  const [results, setResults] = useState<typeof recipes | null>(null)
  const [own, setOwn] = useState('')
  // FAVOURITES tab lists the Favourites collection from Saved (empty if it was deleted, see Saved !3).
  const favourites = useSaved().collections.find((c) => c.id === 'favourites')?.slugs ?? []
  const ResultRow = ({ slug }: { slug: string }) => {
    const r = bySlug[slug]
    return (
      <div className="flex items-center gap-3 py-2">
        <Photo hue={r.hue} className="w-14 h-14 rounded-lg shrink-0" />
        <span className="flex-1 text-[15px]">{r.title}</span>
        <button onClick={() => onAdd({ slug })} className="bg-brand text-white text-[13px] rounded-full pl-1.5 pr-2.5 py-0.5 inline-flex items-center"><Icon name="add" size={16} />Add</button>
      </div>
    )
  }
  return (
    <Sheet title={title} onClose={onClose}>
      <div className="flex justify-center gap-1 border-b border-chip">
        {(['SEARCH', 'FAVOURITES'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-t-lg border border-b-0 px-4 py-2 ${tab === t ? 'bg-brand border-brand text-white' : 'border-line text-brand'}`}>{t}</button>))}
      </div>
      {tab === 'FAVOURITES' ? <div className="mt-2">{favourites.map((s) => <ResultRow key={s} slug={s} />)}</div> : <>
        <p className="mt-3 text-[15px]">Suggested {meal.toLowerCase()} recipes…</p>
        <div className="flex gap-3 overflow-x-auto mt-2 -mx-4 px-4">
          {poolFor(meal).map((r) => (
            <div key={r.slug} className="w-[188px] shrink-0">
              <div className="relative">
                <Photo hue={r.hue} className="h-[180px] rounded-lg" />
                <button onClick={() => onAdd({ slug: r.slug })} className="absolute top-1.5 right-1.5 bg-brand text-white text-[13px] rounded-full pl-1.5 pr-2.5 py-0.5 inline-flex items-center"><Icon name="add" size={16} />Add</button>
                <Heart className="top-8 right-2" />
              </div>
              <div className="text-[15px] mt-1 leading-snug">{r.title}</div>
            </div>
          ))}
        </div>
        <form className="mt-5" onSubmit={(e) => { e.preventDefault(); setResults(recipes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))) }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ingredient, recipe name…" className="w-full border border-line rounded-md px-3 py-2" />
          <div className="text-center mt-3"><button className="inline-flex items-center gap-1 bg-brand text-white rounded-lg px-6 py-2"><Icon name="search" size={20} />Search</button></div>
        </form>
        {results && <div className="mt-2">{results.length ? results.map((r) => <ResultRow key={r.slug} slug={r.slug} />) : <p className="text-muted text-sm">No recipes found.</p>}</div>}
        <p className="mt-5 text-[15px] font-semibold">Cooking your own recipe?</p>
        <div className="flex mt-2">
          <input list="own-recipes" value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Search or add a new recipe" className="flex-1 min-w-0 border border-line rounded-l-md px-3 py-2" />
          <datalist id="own-recipes">{ownRecipes.map((o) => <option key={o} value={o} />)}</datalist>
          <button onClick={() => own.trim() && onAdd({ own: own.trim() })} className="bg-brand text-white rounded-r-md px-6">Add</button>
        </div>
      </>}
    </Sheet>
  )
}

function ListTab() {
  const [closed, setClosed] = useState<string[]>([])
  const [ticked, setTicked] = useState<string[]>([])
  const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v])
  return (
    <div className="px-4">
      {/* Share: the share sheet for the list was not captured in the audit */}
      <div className="text-center mt-3"><button className="inline-flex items-center gap-1 text-brand text-[17px]"><Icon name="share" size={20} />Share</button></div>
      {shoppingList.map(({ aisle, icon, items }) => (
        <section key={aisle} className="mt-3">
          <button onClick={() => setClosed(toggle(closed, aisle))} className="text-[19px] font-semibold">
            <span className={`inline-block mr-2 text-sm transition-transform ${closed.includes(aisle) ? '-rotate-90' : ''}`}>▼</span>{icon} {aisle}
          </button>
          {!closed.includes(aisle) && items.map((it) => (
            <label key={it} className="flex items-center gap-2 pl-5 py-0.5 text-[16px]">
              <input type="checkbox" checked={ticked.includes(it)} onChange={() => setTicked(toggle(ticked, it))} className="w-3.5 h-3.5" />{it}
            </label>
          ))}
        </section>
      ))}
    </div>
  )
}
