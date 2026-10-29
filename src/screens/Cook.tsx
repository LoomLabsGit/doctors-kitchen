import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { cookalong, type CookStep, type Timer } from '../data/cookalong'
import { amount, detailFor, type Line } from '../data/recipeDetail'
import { Icon, Photo, Sheet } from '../components/ui'

// IMPROVED (new feature): audio-guided "Cook now" mode. One step per page with its photo, Dr Rupy reading it aloud,
// and any timers. A started timer keeps running as a compact bar at the top of every later step.
// Full screen: Shell hides the header and bottom bar on /recipe/:slug/cook.

type Running = { id: string; step: number; label: string; secs: number; endsAt: number | null; left: number; done: boolean }
// Whole seconds, rounded up, so a timer reads 1:00 (not 0:00) the moment it starts.
const fmt = (s: number) => { const t = Math.max(0, Math.ceil(s)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` }
const leftOf = (t: Running, now: number) => (t.endsAt ? Math.max(0, (t.endsAt - now) / 1000) : t.left)

// Three short beeps and a buzz when a timer finishes.
function alarm() {
  try {
    const ctx = new AudioContext()
    ;[0, 0.35, 0.7].forEach((at) => {
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.frequency.value = 880; g.gain.value = 0.2
      o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + at); o.stop(ctx.currentTime + at + 0.2)
    })
  } catch { /* no audio: the bar still shows Done */ }
  navigator.vibrate?.([300, 150, 300])
}

export default function Cook() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()
  const r = recipes.find((x) => x.slug === slug)
  const plan = cookalong[slug]
  const [timers, setTimers] = useState<Running[]>([])
  const [now, setNow] = useState(() => Date.now())
  const [ingredients, setIngredients] = useState(false)

  // Tick while any timer is running, and ring the ones that have just run out.
  const ticking = timers.some((t) => t.endsAt && !t.done)
  useEffect(() => {
    if (!ticking) return
    const id = setInterval(() => {
      const at = Date.now()
      setNow(at)
      setTimers((ts) => {
        const finished = ts.filter((t) => t.endsAt && !t.done && t.endsAt <= at)
        if (!finished.length) return ts
        alarm()
        return ts.map((t) => (finished.includes(t) ? { ...t, endsAt: null, left: 0, done: true } : t))
      })
    }, 250)
    return () => clearInterval(id)
  }, [ticking])

  if (!r || !plan) return <Navigate to={r ? `/recipe/${slug}` : '/'} replace />
  const total = plan.steps.length
  const n = Math.min(Math.max(1, Number(sp.get('step')) || 1), total + 1)
  const go = (to: number) => setSp({ step: String(to) }, { replace: true })
  const exit = () => nav(`/recipe/${slug}`, { replace: true })

  const timerId = (step: number, i: number) => `${step}-${i}`
  const start = (step: number, i: number, t: Timer) => setTimers((ts) => [...ts.filter((x) => x.id !== timerId(step, i)),
    { id: timerId(step, i), step, label: t.label, secs: t.secs, endsAt: Date.now() + t.secs * 1000, left: t.secs, done: false }])
  const pause = (id: string) => setTimers((ts) => ts.map((t) => (t.id === id && t.endsAt ? { ...t, left: leftOf(t, Date.now()), endsAt: null } : t)))
  const resume = (id: string) => setTimers((ts) => ts.map((t) => (t.id === id ? { ...t, endsAt: Date.now() + t.left * 1000 } : t)))
  const remove = (id: string) => setTimers((ts) => ts.filter((t) => t.id !== id))
  const controls = { start, pause, resume, remove }

  if (n > total) return <Finished r={r} onClose={exit} onRestart={() => go(1)} />
  const step = plan.steps[n - 1]
  const lines = detailFor(r).groups.flatMap((g) => g.lines)
  // Timers started on other steps follow you as compact bars at the top.
  const elsewhere = timers.filter((t) => t.step !== n)

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="shrink-0 flex items-center gap-2 px-2 pt-3">
        <button aria-label="Close cook along" onClick={exit} className="w-11 h-11 grid place-items-center"><Icon name="close" size={28} /></button>
        <div className="flex-1 min-w-0 text-center">
          <div className="text-[15px] font-bold uppercase text-brand">Cooking with Dr Rupy</div>
          <div className="text-[15px] text-muted truncate">{r.title}</div>
        </div>
        <button aria-label="Ingredients" onClick={() => setIngredients(true)} className="w-11 h-11 grid place-items-center text-brand"><Icon name="format_list_bulleted" size={26} /></button>
      </header>
      <div className="shrink-0 flex gap-1 px-4 mt-2" aria-hidden>
        {plan.steps.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < n ? 'bg-brand' : 'bg-line'}`} />)}
      </div>
      {elsewhere.length > 0 && (
        <div className="shrink-0 px-4 mt-3 space-y-2">
          {elsewhere.map((t) => <CompactTimer key={t.id} t={t} now={now} onGo={() => go(t.step)} {...controls} />)}
        </div>
      )}

      <main key={n} className="flex-1 overflow-y-auto px-4 pb-6">
        <StepImage step={step} hue={r.hue} />
        <h1 className="mt-5 text-[26px] font-semibold leading-tight">Step {n} <span className="text-muted font-normal">of {total}</span></h1>
        <p className="mt-3 text-[18px] leading-relaxed">{step.text}</p>
        <StepIngredients lines={lines.filter((l) => step.uses?.includes(l.name))} />
        <AudioPlayer src={step.audio} />
        {step.timers && <>
          <h2 className="mt-6 text-[14px] uppercase tracking-wide text-muted">{step.timers.length > 1 ? 'Timers' : 'Timer'}</h2>
          {step.timers.map((t, i) => (
            <TimerCard key={i} def={t} t={timers.find((x) => x.id === timerId(n, i))} now={now}
              onStart={() => start(n, i, t)} {...controls} />
          ))}
        </>}
      </main>

      <footer className="shrink-0 flex gap-3 px-4 pt-3 pb-4 border-t border-line bg-white">
        <button onClick={() => go(n - 1)} disabled={n === 1}
          className="w-[120px] h-14 rounded-2xl border-2 border-line text-[17px] font-semibold inline-flex items-center justify-center gap-1 disabled:opacity-40">
          <Icon name="arrow_back" size={22} />Back
        </button>
        <button onClick={() => go(n + 1)} className="flex-1 h-14 rounded-2xl bg-brand text-white text-[17px] font-semibold inline-flex items-center justify-center gap-1">
          {n === total ? 'Finish cooking' : 'Next step'}<Icon name={n === total ? 'check' : 'arrow_forward'} size={24} />
        </button>
      </footer>

      {ingredients && <IngredientsSheet slug={slug} onClose={() => setIngredients(false)} />}
    </div>
  )
}

// "You'll need": the ingredients this step uses, with their amounts from the recipe (for the recipe's base servings).
function StepIngredients({ lines }: { lines: Line[] }) {
  if (!lines.length) return null
  return (
    <div className="mt-5 rounded-2xl bg-[#faf6f0] px-4 py-3">
      <h2 className="text-brand text-[14px] uppercase tracking-wide">You'll need</h2>
      <ul className="mt-1 divide-y divide-line/70">
        {lines.map((l) => (
          <li key={l.name} className="flex gap-3 py-2 text-[17px]">
            <span className="w-[72px] shrink-0 font-semibold">{amount(l, 2, false)}</span>
            <span>{l.name}{l.note && <span className="text-muted"> {l.note}</span>}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// The step's photo, or a calm placeholder for prep-only steps (and if the photo file isn't on this machine).
// Also used by the Method tab on Recipe detail.
export function StepImage({ step, hue, className = 'mt-4' }: { step: CookStep; hue: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (step.image && !failed) return <img src={step.image} alt="" onError={() => setFailed(true)} className={`${className} w-full aspect-[3/2] object-cover rounded-2xl`} />
  return (
    <div className={`${className} w-full aspect-[3/2] rounded-2xl bg-[#faf6f0] grid place-items-center text-center`} style={{ boxShadow: `inset 0 0 0 1px hsl(${hue} 30% 88%)` }}>
      <div className="text-brand"><Icon name="content_cut" size={56} /><div className="text-[15px] text-muted mt-1">Prep step</div></div>
    </div>
  )
}

function AudioPlayer({ src }: { src?: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState({ at: 0, len: 0 })
  const [missing, setMissing] = useState(!src)
  // Each step starts reading itself out as soon as you arrive (you got here by tapping, so the browser allows it).
  useEffect(() => { ref.current?.play().catch(() => setPlaying(false)) }, [src])
  const toggle = () => { const a = ref.current; if (!a) return; if (a.paused) a.play().catch(() => {}); else a.pause() }
  const replay = () => { const a = ref.current; if (!a) return; a.currentTime = 0; a.play().catch(() => {}) }
  return (
    <div className="mt-6 rounded-2xl bg-brand-soft p-4">
      <div className="flex items-center gap-3">
        <button aria-label={playing ? 'Pause' : 'Play'} onClick={toggle} disabled={missing}
          className="shrink-0 w-16 h-16 rounded-full bg-brand text-white grid place-items-center disabled:opacity-40">
          <Icon name={playing ? 'pause' : 'play_arrow'} size={38} fill />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-semibold flex items-center gap-1">
            <Icon name={playing ? 'graphic_eq' : 'headphones'} size={20} className="text-brand" />{missing ? "Audio isn't available on this device" : 'Listen to Dr Rupy'}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white overflow-hidden">
            <div className="h-full bg-brand transition-[width] duration-200" style={{ width: `${time.len ? (time.at / time.len) * 100 : 0}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[14px] text-muted"><span>{fmt(time.at)}</span><span>{fmt(time.len)}</span></div>
        </div>
        <button aria-label="Replay this step" onClick={replay} disabled={missing}
          className="shrink-0 w-12 h-12 rounded-full bg-white text-brand grid place-items-center disabled:opacity-40"><Icon name="replay" size={26} /></button>
      </div>
      {src && <audio ref={ref} src={src} preload="auto"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setTime({ at: 0, len: e.currentTarget.duration })}
        onTimeUpdate={(e) => setTime({ at: e.currentTarget.currentTime, len: e.currentTarget.duration || 0 })}
        onError={() => setMissing(true)} />}
    </div>
  )
}

type Controls = { pause: (id: string) => void; resume: (id: string) => void; remove: (id: string) => void }

// Full timer for the step you're on: ring, time left, start / pause / resume / reset.
function TimerCard({ def, t, now, onStart, pause, resume, remove }: { def: Timer; t?: Running; now: number; onStart: () => void } & Controls) {
  const left = t ? leftOf(t, now) : def.secs
  const part = t ? 1 - left / def.secs : 0
  const C = 2 * Math.PI * 26
  return (
    <div className={`mt-2 rounded-2xl border-2 px-3 py-2.5 flex items-center gap-3 ${t?.done ? 'border-[#f0b44c] bg-[#fff8ec]' : 'border-line'}`}>
      <div className="relative shrink-0 w-12 h-12">
        <svg viewBox="0 0 60 60" className="w-12 h-12 -rotate-90">
          <circle cx="30" cy="30" r="26" fill="none" stroke="#e8ebee" strokeWidth="5" />
          <circle cx="30" cy="30" r="26" fill="none" stroke={t?.done ? '#f0b44c' : '#12a676'} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${part * C} ${C}`} />
        </svg>
        <Icon name={t?.done ? 'alarm' : 'timer'} size={22} className={`absolute inset-0 m-auto h-fit w-fit ${t?.done ? 'text-[#c98a1a]' : 'text-brand'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-muted truncate">{def.label}</div>
        <div className="text-[26px] font-semibold tabular-nums leading-tight">{t?.done ? 'Done!' : fmt(left)}</div>
      </div>
      <div className="shrink-0 flex items-center gap-1">
        {!t && <button onClick={onStart} className="h-11 px-5 rounded-full bg-brand text-white font-semibold inline-flex items-center gap-1"><Icon name="play_arrow" size={22} fill />Start</button>}
        {t && !t.done && (t.endsAt
          ? <button onClick={() => pause(t.id)} className="h-11 px-5 rounded-full bg-ink text-white font-semibold inline-flex items-center gap-1"><Icon name="pause" size={22} fill />Pause</button>
          : <button onClick={() => resume(t.id)} className="h-11 px-5 rounded-full bg-brand text-white font-semibold inline-flex items-center gap-1"><Icon name="play_arrow" size={22} fill />Resume</button>)}
        {t && <button aria-label="Reset timer" onClick={() => remove(t.id)} className="w-10 h-10 rounded-full text-muted grid place-items-center"><Icon name="restart_alt" size={22} /></button>}
      </div>
    </div>
  )
}

// Compact bar for a timer started on another step. Tap the label to jump back to its step.
function CompactTimer({ t, now, onGo, pause, resume, remove }: { t: Running; now: number; onGo: () => void } & Controls) {
  return (
    <div className={`flex items-center gap-2 rounded-full pl-3 pr-1 h-11 ${t.done ? 'bg-[#f0b44c] text-ink' : 'bg-ink text-white'}`}>
      <Icon name={t.done ? 'alarm' : 'timer'} size={20} />
      <button onClick={onGo} className="flex-1 min-w-0 text-left truncate text-[15px]">{t.label} <span className="opacity-70">· step {t.step}</span></button>
      <span className="font-semibold tabular-nums text-[17px]">{t.done ? 'Done' : fmt(leftOf(t, now))}</span>
      {t.done
        ? <button aria-label="Dismiss timer" onClick={() => remove(t.id)} className="w-9 h-9 grid place-items-center"><Icon name="close" size={20} /></button>
        : t.endsAt
          ? <button aria-label="Pause timer" onClick={() => pause(t.id)} className="w-9 h-9 grid place-items-center"><Icon name="pause" size={22} fill /></button>
          : <button aria-label="Resume timer" onClick={() => resume(t.id)} className="w-9 h-9 grid place-items-center"><Icon name="play_arrow" size={22} fill /></button>}
    </div>
  )
}

function IngredientsSheet({ slug, onClose }: { slug: string; onClose: () => void }) {
  const r = recipes.find((x) => x.slug === slug)!
  const d = detailFor(r)
  return (
    <Sheet title="Ingredients" onClose={onClose}>
      {d.groups.filter((g) => g.lines.length).map((g) => (
        <section key={g.title} className="mb-4">
          <h3 className="text-brand text-[14px] uppercase tracking-wide">{g.title}</h3>
          <ul className="mt-1 divide-y divide-line/60">
            {g.lines.map((l) => <li key={l.name} className="py-2 text-[17px]"><span className="text-muted">{amount(l, 2, false)}</span> {l.name}{l.note && <span className="text-muted"> {l.note}</span>}</li>)}
          </ul>
        </section>
      ))}
    </Sheet>
  )
}

function Finished({ r, onClose, onRestart }: { r: (typeof recipes)[number]; onClose: () => void; onRestart: () => void }) {
  return (
    <div className="h-full flex flex-col bg-white px-6 pt-10 pb-6 text-center">
      <Photo hue={r.hue} src={r.image} className="w-full aspect-[3/2] rounded-2xl" />
      <Icon name="celebration" size={44} className="text-brand mt-6 block mx-auto" />
      <h1 className="text-[26px] font-semibold mt-2">Enjoy your meal</h1>
      <p className="text-[17px] text-muted mt-2">You've cooked {r.title}.</p>
      <div className="mt-auto space-y-3">
        <button onClick={onClose} className="w-full h-14 rounded-2xl bg-brand text-white text-[17px] font-semibold">Back to the recipe</button>
        <button onClick={onRestart} className="w-full h-12 rounded-2xl text-brand text-[17px] font-semibold">Start again</button>
        <Link to="/" className="block text-muted text-[15px]">Back to recipes</Link>
      </div>
    </div>
  )
}
