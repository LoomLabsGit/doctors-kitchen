import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { recipes, type Recipe } from '../data/recipes'
import { CHIPS, HEALTH_TOPICS, INGREDIENT_TOPICS, KIND, course, items, label, topic, type Item, type Kind } from '../data/learn'
import { Heart, Icon, Photo } from '../components/ui'
import { useImproved } from '../lib/version'
import { useBack } from '../lib/back'
import { ordinal, parseIso } from '../lib/dates'

const longDate = (d: string) => { const x = parseIso(d); return `${ordinal(x.getDate())} ${x.toLocaleDateString('en-GB', { month: 'short' })} ${x.getFullYear()}` }
const INDEXES: Record<string, typeof HEALTH_TOPICS> = { 'what-to-eat-for': HEALTH_TOPICS, ingredients: INGREDIENT_TOPICS }

export function LearnHome() {
  return (
    <div className="pb-8">
      <h1 className="px-4 text-[26px] font-semibold">Learn</h1>
      <SearchBox />
      <Chips />
      <section className="mt-5">
        <h2 className="px-4 text-[19px] font-semibold">Nutrition basics with Dr Rupy <Icon name="check_circle" size={20} fill className="text-brand" /> <span className="font-normal text-[16px]">0 of 8</span></h2>
        {/* Course progress and playback were not captured in the audit, so the lessons are inert */}
        <div className="flex gap-3 overflow-x-auto px-4 mt-1">
          {course.map(([t, len]) => (
            <div key={t} className="shrink-0 w-[300px]">
              <div className="text-[14px] font-semibold">{t} <span className="font-normal text-muted inline-flex items-center gap-0.5"><Icon name="schedule" size={15} />{len}</span></div>
              <div className="h-[170px] mt-1 rounded-lg bg-black grid place-items-center text-white"><Icon name="play_circle" size={64} /></div>
            </div>
          ))}
        </div>
      </section>
      <Carousel title="For you" list={items.filter((i) => i.forYou)} />
      <Carousel title="Added recently" list={items.filter((i) => i.recent)} />
      <h2 className="px-4 mt-6 text-[19px] font-semibold">Ways to learn</h2>
      <div className="grid grid-cols-3 gap-6 px-4 mt-2">
        {(['read', 'listen', 'watch'] as Kind[]).map((k) => (
          <Link key={k} to={`/learn/${k}`} className="bg-[#faf6f0] border border-line rounded-lg py-3 text-center text-[17px]">
            <Icon name={KIND[k].icon} size={28} fill className="text-brand block mx-auto" />{k[0].toUpperCase() + k.slice(1)}
          </Link>
        ))}
      </div>
      <div className="text-center mt-6"><Link to="/learn/protein" className="inline-block border border-brand text-brand rounded-lg px-6 py-2 text-[20px]">💪 Try our protein calculator</Link></div>
    </div>
  )
}

function SearchBox({ initial = '' }: { initial?: string }) {
  const nav = useNavigate()
  const [q, setQ] = useState(initial)
  return (
    <form className="flex px-4 mt-2" onSubmit={(e) => { e.preventDefault(); nav(`/learn/search?q=${encodeURIComponent(q)}`) }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by health condition, ingredient…" className="flex-1 min-w-0 border border-line rounded-l-md px-3 py-2" />
      <button aria-label="Search" className="shrink-0 bg-brand text-white px-8 rounded-r-md grid place-items-center"><Icon name="search" size={26} /></button>
    </form>
  )
}

// UX issue Learn !1: the chips scroll sideways in two rows, so e.g. Nutrition basics starts off-screen.
// `kind` is set on the Read / Listen / Watch lists: the chip then opens that category filtered to the same kind.
function Chips({ kind }: { kind?: Kind }) {
  return (
    <div className="overflow-x-auto px-4 mt-3 pb-1 space-y-2">
      {[CHIPS.filter((_, n) => n % 2 === 0), CHIPS.filter((_, n) => n % 2 === 1)].map((row, r) => (
        <div key={r} className="flex gap-2 w-max">
          {row.map((c) => (
            <Link key={c.slug} to={`/learn/topic/${c.slug}${kind ? `?type=${kind}` : ''}`}
              className="bg-[#faf6f0] border border-line rounded-lg px-3 py-2 text-[18px] whitespace-nowrap inline-flex items-center gap-2"><Icon name={c.icon} size={24} fill className="text-brand" />{c.name}</Link>
          ))}
        </div>
      ))}
    </div>
  )
}

function Card({ i, badge = true, wide }: { i: Item; badge?: boolean; wide?: boolean }) {
  return (
    <Link to={`/learn/item/${i.id}`} className={`block min-w-0 ${wide ? 'shrink-0 w-[300px]' : ''}`}>
      <div className="relative">
        <Photo hue={i.hue} className={`${wide ? 'h-[175px]' : 'aspect-[5/3]'} rounded-lg`} />
        {badge && <span className="absolute bottom-3 -left-2 inline-flex items-center gap-1 bg-brand text-white text-[13px] font-bold px-2 py-0.5 rounded"><Icon name={KIND[i.kind].icon} size={16} fill />{KIND[i.kind].badge}</span>}
      </div>
      <div className="text-brand text-[12px] font-bold mt-2">{label(i)}</div>
      <div className="text-[17px] leading-snug line-clamp-2">{i.title}</div>
    </Link>
  )
}

function Carousel({ title, list }: { title: string; list: Item[] }) {
  if (!list.length) return null
  return (
    <section className="mt-6">
      <h2 className="px-4 text-[19px] font-semibold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto px-4 mt-2">{list.map((i) => <Card key={i.id} i={i} wide />)}</div>
    </section>
  )
}

const Grid = ({ list, badge }: { list: Item[]; badge?: boolean }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-4 mt-4">{list.map((i) => <Card key={i.id} i={i} badge={badge} />)}</div>
)
const Notice = ({ children }: { children: ReactNode }) => <div className="mx-4 mt-4 bg-[#d5ecf1] text-[#1d5f77] rounded px-4 py-3 text-[16px]">{children}</div>

export function LearnSearch() {
  const [sp] = useSearchParams()
  const q = (sp.get('q') ?? '').trim().toLowerCase()
  const list = q ? items.filter((i) => (i.title + ' ' + label(i)).toLowerCase().includes(q)) : []
  return (
    <div className="pb-6">
      <SearchBox key={q} initial={sp.get('q') ?? ''} />
      {/* UX issue Learn !2: no result count and no way to filter by article, podcast or video */}
      <h1 className="px-4 mt-4 text-[26px] font-semibold">Learn search</h1>
      {/* UX issue Learn !3: a plain notice with no suggestions (recipe search offers popular categories) */}
      {list.length ? <Grid list={list} badge /> : <Notice>There are no articles that match your search terms</Notice>}
    </div>
  )
}

function Banner({ title, hue }: { title: string; hue: number }) {
  const back = useBack()
  return (
    <div className="h-[150px] flex items-end justify-between px-4 pb-6" style={{ background: `linear-gradient(135deg, hsl(${hue} 35% 35%), hsl(${hue + 30} 45% 60%))` }}>
      <button onClick={back} className="text-white text-[28px] font-semibold text-left leading-tight flex items-center gap-2"><Icon name="arrow_back" size={30} />{title}</button>
      {/* Notification bell: not captured in the audit, left inert */}
      <span className="shrink-0 bg-[#f3efe9] border-2 border-brand rounded-lg w-[124px] h-9 grid place-items-center text-brand"><Icon name="notifications" size={20} fill /></span>
    </div>
  )
}

// A category from the chips, or a topic from the What to eat for / Ingredients grids. `?type=` keeps the Read / Listen / Watch filter.
export function LearnTopic() {
  const { slug = '' } = useParams()
  const [sp, setSp] = useSearchParams()
  const type = sp.get('type') as Kind | null
  const t = topic(slug)
  const improved = useImproved()
  if (!t) return <p className="p-4">Not found. <Link to="/learn" className="text-brand">Back to Learn</Link></p>
  const index = INDEXES[slug]
  const all = items.filter((i) => i.topics.includes(slug))
  const count = (k: Kind) => all.filter((i) => i.kind === k).length
  const list = all.filter((i) => !type || i.kind === type)
  // IMPROVED (UX issue Learn !4): All / Articles / Podcasts / Videos tabs with counts (empty kinds disabled), and a kind
  // with nothing in this category falls back to the full list with a note instead of an empty page.
  const missing = improved && type && !count(type) ? type : null
  const shown = missing ? all : list
  return (
    <div className="pb-6">
      <Banner title={t.name} hue={t.hue} />
      {index ? (
        <div className="grid grid-cols-2 gap-4 px-4 mt-6">
          {index.map((x) => (
            <Link key={x.slug} to={`/learn/topic/${x.slug}${type ? `?type=${type}` : ''}`} className="bg-[#faf6f0] border border-[#d9ece4] rounded-lg px-3 py-4 flex items-center gap-2 text-[19px] leading-tight min-h-[86px]">
              <Icon name={x.icon} size={28} className="text-ink" />{x.name}
            </Link>
          ))}
        </div>
      ) : <>
        {improved && all.length > 0 && <div className="flex gap-2 px-4 mt-4 overflow-x-auto">
          <KindTab on={!type || !!missing} onClick={() => setSp({})}>All ({all.length})</KindTab>
          {(['read', 'listen', 'watch'] as Kind[]).map((k) => (
            <KindTab key={k} on={type === k && !missing} disabled={!count(k)} onClick={() => setSp({ type: k })}>{KIND[k].list} ({count(k)})</KindTab>
          ))}
        </div>}
        {missing && <Notice>There are no {KIND[missing].one} in {t.name} yet, so this shows everything.</Notice>}
        {shown.length ? <Grid list={shown} badge />
          // AS-IS (UX issue Learn !4): a filtered list can come back empty with only this notice, and "click here" is the only way out
          : type ? <Notice><Icon name="search" size={20} /> We're filtering this list for {KIND[type].one}. To remove this filter and see the full list, <button onClick={() => setSp({})} className="text-brand">click here</button>.</Notice>
          : <Notice>There is nothing here yet.</Notice>}
      </>}
    </div>
  )
}

const KindTab = ({ children, on, disabled, onClick }: { children: ReactNode; on: boolean; disabled?: boolean; onClick: () => void }) => (
  <button disabled={disabled} onClick={onClick}
    className={`shrink-0 rounded-full border px-3 min-h-[40px] text-[15px] ${on ? 'bg-brand text-white border-brand' : disabled ? 'border-line text-line' : 'border-line text-ink'}`}>{children}</button>
)

// Read / Listen / Watch from "Ways to learn". No badges on these lists (as-is).
export function LearnList({ kind }: { kind: Kind }) {
  return (
    <div className="pb-6">
      {kind === 'listen' ? (
        <div className="mx-4 bg-[#faf6f0] rounded-lg pb-5 text-center">
          <div className="mx-6 pt-6 pb-8 bg-[#f4a3a6] rounded-[50%] text-white text-[34px] font-bold leading-tight">The Doctor's Kitchen Podcast</div>
          {/* External podcast apps: left inert */}
          <div className="flex flex-col items-center gap-3 mt-4 text-brand text-[18px]">
            <span className="border border-brand rounded-lg px-5 py-1.5">Listen on Apple</span><span className="border border-brand rounded-lg px-5 py-1.5">Listen on Spotify</span>
          </div>
        </div>
      ) : <h1 className="px-4 text-[26px] font-semibold text-brand">{KIND[kind].list}</h1>}
      <Chips kind={kind} />
      <Grid list={items.filter((i) => i.kind === kind)} badge={false} />
    </div>
  )
}

export function LearnItem() {
  const { id } = useParams()
  const i = items.find((x) => x.id === id)
  const [refs, setRefs] = useState(false)
  if (!i) return <p className="p-4">Not found. <Link to="/learn" className="text-brand">Back to Learn</Link></p>
  const related = items.filter((x) => x.id !== i.id && x.topics.some((t) => i.topics.includes(t))).slice(0, 4)
  const points = ['What is it?', 'Why it matters', 'How to start']
  return (
    <div className="pb-8">
      <div className="px-4 flex justify-between items-center"><span className="text-brand text-[14px] font-bold">{label(i)}</span><Icon name="forward" size={24} fill className="text-brand" /></div>
      <h1 className="px-4 text-[26px] font-semibold leading-tight mt-1">{i.title}</h1>
      <p className="px-4 text-muted text-[18px] mt-1">{longDate(i.date)}</p>
      <p className="px-4 text-[19px] leading-snug mt-3">Placeholder introduction. The live app's text is not copied into the prototype; this stands in for a short opening paragraph.</p>
      <div className="px-4 mt-4">
        {i.kind === 'watch'
          ? <div className="h-[200px] rounded-lg bg-black grid place-items-center"><span className="bg-[#ff0000] text-white rounded-xl px-4 py-1.5 grid place-items-center"><Icon name="play_arrow" size={32} fill /></span></div>
          : <Photo hue={i.hue} className="h-[190px] rounded-lg" />}
      </div>
      {i.kind === 'listen' && (
        <div className="mx-4 mt-4 bg-[#faf6f0] rounded-lg py-5 text-center">
          <div className="font-semibold text-[15px]">Listen now on your favourite platform:</div>
          <div className="flex flex-col items-center gap-3 mt-3 text-brand text-[18px]">
            {['Apple', 'Spotify', 'YouTube'].map((p) => <span key={p} className="border border-brand rounded-lg px-6 py-1.5">{p}</span>)}
          </div>
        </div>
      )}
      {i.kind === 'read' && <>
        <h2 className="px-4 mt-5 font-semibold text-[17px]">Key points</h2>
        <ul className="px-4 ml-6 list-disc text-brand text-[18px] space-y-1 mt-1">{points.map((p, n) => <li key={p}><a href={`#kp-${n}`} onClick={(e) => { e.preventDefault(); document.getElementById(`kp-${n}`)?.scrollIntoView({ behavior: 'smooth' }) }}>{p}</a></li>)}</ul>
        {points.map((p, n) => <section key={p} id={`kp-${n}`} className="px-4 mt-5">
          <h2 className="text-[22px] font-semibold">{p}</h2>
          <p className="text-[17px] leading-relaxed mt-2">Placeholder body text for this section of the article.</p>
        </section>)}
      </>}
      <button onClick={() => setRefs(!refs)} className="px-4 mt-5 font-semibold text-[15px] flex items-center gap-1"><Icon name={refs ? 'keyboard_arrow_down' : 'chevron_right'} size={20} />References/sources</button>
      {refs && <p className="px-4 text-[14px] text-muted mt-1">Placeholder list of references.</p>}
      <section className="mt-6">
        <h2 className="px-4 text-[19px] font-semibold">Relevant recipes</h2>
        <RecipeCarousel list={recipes.filter((r) => r.categories.includes('High Protein'))} />
      </section>
      <Carousel title="Related content" list={related} />
    </div>
  )
}

function RecipeCarousel({ list }: { list: Recipe[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 mt-2">
      {list.map((r) => (
        <Link key={r.slug} to={`/recipe/${r.slug}`} className="shrink-0 w-[190px]">
          <div className="relative">
            <Photo hue={r.hue} src={r.image} className="h-[180px] rounded-lg" />
            <Heart />
            {r.isNew && <span className="absolute bottom-3 -left-1 bg-brand text-white text-[12px] font-bold px-2 py-0.5 rounded">NEW!</span>}
          </div>
          <div className="font-semibold text-[17px] leading-tight mt-2 line-clamp-2">{r.title}</div>
        </Link>
      ))}
    </div>
  )
}

// Questions appear one at a time as each is answered (06_Learn/19 to 25). The formula is made up for the prototype.
type Calc = { units: 'kg' | 'lb'; gender: 'Female' | 'Male'; weight: string; age?: string; exercise?: string; status?: string; goal?: string }
function estimate(c: Calc) {
  const kg = c.units === 'kg' ? Number(c.weight) : Number(c.weight) / 2.2046
  const perKg = 1 + (c.gender === 'Female' ? -0.1 : 0) + (c.age === '50+ years old' ? 0.2 : 0)
    + ({ None: 0, '1 or 2 sessions per week': 0.2, '3+ sessions per week': 0.4 } as Record<string, number>)[c.exercise!]
    + ({ 'Maintain weight': 0, 'Gain muscle': 0.4, 'Lose fat': 0.3 } as Record<string, number>)[c.goal!]
  return Math.round(perKg * kg * (c.status === 'Overweight or obese' ? 0.85 : 1))
}

export function ProteinCalculator() {
  // UX issue Learn !5: Male is pre-selected, so skipping the question gives a male estimate.
  const [c, setC] = useState<Calc>({ units: 'kg', gender: 'Male', weight: '' })
  const set = (p: Partial<Calc>) => setC({ ...c, ...p })
  const w = Number(c.weight)
  const [min, max] = c.units === 'kg' ? [30, 250] : [66, 550]
  const valid = c.weight !== '' && w >= min && w <= max
  const g = c.goal ? estimate(c) : 0
  return (
    <div className="pb-8 px-4">
      <h1 className="text-center text-[26px] font-semibold">Protein Calculator</h1>
      <p className="text-center text-[19px] text-[#444] mt-1">Protein needs vary from person to person. Answer a few quick questions to get a personalised estimate.</p>
      <Question q="Which units do you prefer using?" options={['Metric (kg)', 'Imperial (lb)']} value={c.units === 'kg' ? 'Metric (kg)' : 'Imperial (lb)'} onPick={(v) => set({ units: v.startsWith('Metric') ? 'kg' : 'lb' })} />
      <Question q="What is your gender?" options={['Female', 'Male']} value={c.gender} onPick={(v) => set({ gender: v as Calc['gender'] })} />
      <h2 className="font-semibold text-[19px] mt-6">What is your current weight (in {c.units})?</h2>
      <input inputMode="decimal" value={c.weight} onChange={(e) => set({ weight: e.target.value.replace(/[^\d.]/g, '') })} className="w-full border border-line rounded-md px-3 py-2 mt-2 text-[17px]" />
      {/* UX issue Learn !6: out-of-range weights are rejected without saying what range is accepted */}
      {c.weight !== '' && !valid && <p className="text-[#d32f2f] text-[15px] mt-1">Please enter a valid weight</p>}
      {valid && <Question q="Are you..." options={['Under 50 years old', '50+ years old']} value={c.age} onPick={(v) => set({ age: v })} />}
      {valid && c.age && <Question q="How much exercise do you do per week?" options={['None', '1 or 2 sessions per week', '3+ sessions per week']} value={c.exercise} onPick={(v) => set({ exercise: v })} />}
      {valid && c.exercise && <Question q="Are you currently..." options={['A healthy weight', 'Overweight or obese']} value={c.status} onPick={(v) => set({ status: v })} />}
      {valid && c.status && <Question q="What is your current goal?" options={['Maintain weight', 'Gain muscle', 'Lose fat']} value={c.goal} onPick={(v) => set({ goal: v })} />}
      {valid && c.goal && <>
        <div className="bg-[#faf6f0] rounded-lg px-4 py-6 mt-8 text-center text-[20px]">
          Aim for at least <b>{g}g</b> of protein per day.
          <p className="mt-5">👉 That's around {Math.round(g / 3)}g per meal</p><p className="text-[15px]">(if you have 3 meals per day)</p>
        </div>
        <h2 className="font-semibold text-[19px] mt-8 -mx-4 px-4">Some suitable recipes for you:</h2>
        <div className="-mx-4"><RecipeCarousel list={recipes.filter((r) => r.categories.includes('High Protein'))} /></div>
      </>}
      <p className="italic text-[13px] text-muted mt-10">Disclaimer: This protein calculator is for information purposes only, and is not to be taken as medical advice. Speak to your physician or a nutrition professional before changing your diet, especially if you have a diagnosed medical condition.</p>
    </div>
  )
}

function Question({ q, options, value, onPick }: { q: string; options: string[]; value?: string; onPick: (v: string) => void }) {
  return (
    <div className="mt-6">
      <h2 className="font-semibold text-[19px]">{q}</h2>
      <div className="space-y-2 mt-2">
        {options.map((o) => (
          <button key={o} onClick={() => onPick(o)} className={`block w-full rounded-lg py-2 text-[17px] shadow-[0_1px_6px_rgba(0,0,0,0.08)] ${value === o ? 'bg-[#6b8fdc] text-white' : 'bg-white text-brand'}`}>{o}</button>
        ))}
      </div>
    </div>
  )
}
