import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { cookalong, type CookStep, type Timer } from '../data/cookalong'
import { Icon, Photo, Sheet } from '../components/ui'
import { ChatSheet } from '../components/ChatSheet'

// IMPROVED (new feature): audio-guided "Step by Step Method". One step per page: photo and a conversational
// instruction with each ingredient's amount written in and highlighted (no separate ingredient list). A dock at the bottom holds Dr Rupy's audio, the timer button (with a
// badge when the step has a timer not yet started) and Back / Next. A running timer shows as one white bar attached
// above the dock: timers don't stack, the bar shows whichever ends first (a finished one first).
// Sizes, fonts and colours of the dock and timer bar follow the design team's Figma frame (node 28:1831).
// Full screen: Shell hides the header and bottom bar on /recipe/:slug/cook.

const BAR_KEY = 'dk-timer-bar'
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
  const [sheet, setSheet] = useState<null | 'timers' | 'chat'>(null)
  // "Show timer bar while cooking" (timer sheet toggle), remembered in this browser. When off, running timers stay
  // hidden and the bar only appears, in alert colours with the alarm, once a timer finishes.
  const [showBar, setShowBar] = useState(() => { try { return localStorage.getItem(BAR_KEY) !== 'hidden' } catch { return true } })
  const toggleBar = () => { const v = !showBar; setShowBar(v); try { localStorage.setItem(BAR_KEY, v ? 'shown' : 'hidden') } catch { /* private mode */ } }

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
  // The one timer shown in the bar: a finished one first, otherwise the one with the least time left.
  const featured = timers.find((t) => t.done) ?? (showBar ? [...timers].sort((a, b) => leftOf(a, now) - leftOf(b, now))[0] : undefined)
  // Badge on the timer button: this step has a timer that hasn't been started yet.
  const badge = !!step.timers?.some((_, i) => !timers.find((x) => x.id === timerId(n, i)))

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="shrink-0 flex items-center gap-2 px-2 pt-3">
        <button aria-label="Close cook along" onClick={exit} className="w-11 h-11 grid place-items-center"><Icon name="close" size={28} /></button>
        <div className="flex-1 min-w-0 text-center">
          <div className="text-[15px] font-bold uppercase text-brand">Cooking with Dr Rupy</div>
          <div className="text-[15px] text-muted truncate">{r.title}</div>
        </div>
        <button aria-label="Ask Dr Rupy" onClick={() => setSheet('chat')} className="w-11 h-11 grid place-items-center text-brand"><Sparkles /></button>
      </header>
      <h1 className="shrink-0 px-4 mt-3 text-[19px] leading-tight"><span className="font-bold">Step {n}</span> <span className="text-muted">of {total}</span></h1>
      <div className="shrink-0 flex gap-1 px-4 mt-2" aria-hidden>
        {plan.steps.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < n ? 'bg-brand' : 'bg-line'}`} />)}
      </div>

      <main key={n} className="flex-1 overflow-y-auto px-4 pb-6">
        <StepImage step={step} hue={r.hue} />
        <StepText step={step} />
      </main>

      <div className="shrink-0">
        {featured && <TimerBar t={featured} now={now} onGo={() => go(featured.step)} {...controls} />}
        {/* Dock (Figma 28:1869): 12px top / 16px sides and bottom, 1px top border, 12px between the audio row and the buttons */}
        <div className={`bg-white px-4 pt-3 pb-4 border-t border-line ${featured ? '' : 'rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.05)]'}`}>
          <div className="flex items-center gap-3">
            <AudioPlayer key={n} src={step.audio} />
            <button aria-label={badge ? 'Timers, one not started' : 'Timers'} onClick={() => setSheet('timers')}
              className="relative shrink-0 w-12 h-12 rounded-full bg-ink text-white grid place-items-center">
              <Icon name="timer" size={22} />
              {badge && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#e57373] border-2 border-white" />}
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => go(n - 1)} disabled={n === 1}
              className="w-[120px] h-14 rounded-2xl border-2 border-line text-[17px] font-semibold inline-flex items-center justify-center gap-1 disabled:opacity-40">
              <Icon name="arrow_back" size={22} />Back
            </button>
            <button onClick={() => go(n + 1)} className="flex-1 h-14 rounded-2xl bg-brand text-white text-[17px] font-semibold inline-flex items-center justify-center gap-1">
              {n === total ? 'Finish cooking' : 'Next step'}<Icon name={n === total ? 'check' : 'arrow_forward'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {sheet === 'timers' && (
        <Sheet title={step.timers && step.timers.length > 1 ? 'Timers' : 'Timer'} onClose={() => setSheet(null)}>
          {step.timers?.length
            ? step.timers.map((t, i) => <TimerCard key={i} def={t} t={timers.find((x) => x.id === timerId(n, i))} now={now} onStart={() => start(n, i, t)} {...controls} />)
            : <p className="text-[17px] text-muted pb-2">This step has no timer.</p>}
          <div className="flex items-start gap-3 mt-3 pt-4 pb-1 border-t border-line">
            <div className="flex-1 min-w-0">
              <div id="bar-toggle" className="text-[17px] font-semibold">Show timer bar while cooking</div>
              <p className="text-[15px] text-muted mt-0.5">When it's off, you'll only see the bar when a timer finishes, with an alarm.</p>
            </div>
            <button role="switch" aria-checked={showBar} aria-labelledby="bar-toggle" onClick={toggleBar}
              className={`shrink-0 mt-0.5 w-12 h-7 rounded-full p-0.5 transition-colors ${showBar ? 'bg-brand' : 'bg-line'}`}>
              <span className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${showBar ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </Sheet>
      )}
      {sheet === 'chat' && <ChatSheet title={r.title} initial="" onClose={() => setSheet(null)} />}
    </div>
  )
}

// Lucide "sparkles" (ISC licence): Material Symbols in this package has no matching icon.
const Sparkles = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
  </svg>
)

// The instruction, with each ingredient and its amount highlighted (and the prepared ingredient when it comes back).
// Amounts live in the sentence itself, so there's no separate "You'll need" list to scroll to.
function StepText({ step }: { step: CookStep }) {
  const terms = step.terms ?? []
  const re = terms.length ? new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi') : null
  return (
    <p className="mt-4 text-[18px] leading-relaxed">
      {(re ? step.text.split(re) : [step.text]).map((part, i) => i % 2
        ? <span key={i} className="text-brand font-semibold underline decoration-2 underline-offset-4">{keepAmountTogether(part)}</span>
        : part)}
    </p>
  )
}
// "1 tbsp tomato purée" never breaks as "1 / tbsp…": join the number, unit and next word with non-breaking spaces.
const keepAmountTogether = (s: string) => s.replace(/^(\d+(?:\.\d+)?) (\S+) (\S+)/, '$1\u00a0$2\u00a0$3')


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
  const track = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState({ at: 0, len: 0 })
  const [missing, setMissing] = useState(!src)
  // While dragging the bar: where the finger is, as a share of the clip (0 to 1). The audio jumps there on release.
  const [drag, setDrag] = useState<number | null>(null)
  // Each step starts reading itself out as soon as you arrive (you got here by tapping, so the browser allows it).
  useEffect(() => { ref.current?.play().catch(() => setPlaying(false)) }, [src])
  // Smooth progress: read the playhead every frame while playing, rather than waiting for the audio's coarse
  // timeupdate events (about four a second), which made the bar move in steps.
  useEffect(() => {
    if (!playing) return
    let id = 0
    const tick = () => { const a = ref.current; if (a) setTime({ at: a.currentTime, len: a.duration || 0 }); id = requestAnimationFrame(tick) }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [playing])
  // Play after the clip has ended starts it again, so the step can always be replayed.
  const toggle = () => { const a = ref.current; if (!a) return; if (a.paused) { if (a.ended) a.currentTime = 0; a.play().catch(() => {}) } else a.pause() }
  const shareAt = (x: number) => { const r = track.current!.getBoundingClientRect(); return Math.min(1, Math.max(0, (x - r.left) / r.width)) }
  const seek = (share: number) => { const a = ref.current; if (!a || !time.len) return; a.currentTime = share * time.len; setTime({ at: a.currentTime, len: time.len }) }
  const share = drag ?? (time.len ? time.at / time.len : 0)
  const canSeek = !missing && time.len > 0
  return (
    <div className="flex-1 min-w-0 flex items-center gap-3">
      <button aria-label={playing ? 'Pause Dr Rupy' : 'Play Dr Rupy'} onClick={toggle} disabled={missing}
        className="shrink-0 w-12 h-12 rounded-full bg-brand text-white grid place-items-center disabled:opacity-40">
        <Icon name={playing ? 'pause' : 'play_arrow'} size={32} weight={300} />
      </button>
      <div className="flex-1 min-w-0">
        {/* Drag or tap the bar to scrub back (or forward) through the step. The 24px-tall hit area keeps it easy to grab. */}
        <div ref={track} role="slider" aria-label="Dr Rupy's audio position" tabIndex={canSeek ? 0 : -1}
          aria-valuemin={0} aria-valuemax={Math.round(time.len)} aria-valuenow={Math.round(share * time.len)} aria-valuetext={fmt(share * time.len)}
          className={`relative h-6 -my-[9px] flex items-center touch-none select-none ${canSeek ? 'cursor-pointer' : ''}`}
          onPointerDown={(e) => { if (!canSeek) return; try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* keep dragging without capture */ } setDrag(shareAt(e.clientX)) }}
          onPointerMove={(e) => { if (drag !== null) setDrag(shareAt(e.clientX)) }}
          onPointerUp={() => { if (drag !== null) { seek(drag); setDrag(null) } }}
          onPointerCancel={() => setDrag(null)}
          onKeyDown={(e) => { if (!canSeek) return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); seek(Math.min(1, Math.max(0, (time.at + (e.key === 'ArrowLeft' ? -1 : 1)) / time.len))) } }}>
          <div className="w-full h-1.5 rounded-full bg-chip overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${share * 100}%` }} />
          </div>
          {drag !== null && <span className="absolute w-4 h-4 -ml-2 rounded-full bg-brand ring-4 ring-brand/20" style={{ left: `${share * 100}%` }} />}
        </div>
        {missing
          ? <div className="mt-1 text-[14px] text-muted truncate">Audio isn't available on this device</div>
          : <div className="mt-0.5 flex justify-between text-[14px] leading-tight tracking-[0.02em] text-muted"><span>{fmt(share * time.len)}</span><span>{fmt(time.len)}</span></div>}
      </div>
      {src && <audio ref={ref} src={src} preload="auto"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setTime({ at: 0, len: e.currentTarget.duration })}
        onTimeUpdate={(e) => { if (!playing) setTime({ at: e.currentTarget.currentTime, len: e.currentTarget.duration || 0 }) }}
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
    <div className={`mb-2 rounded-2xl border-2 px-3 py-2.5 flex items-center gap-3 ${t?.done ? 'border-[#f0b44c] bg-[#fff8ec]' : 'border-line'}`}>
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

// The one timer bar, attached above the dock (Figma 28:1864): white, 44px tall, 16px top corners, soft upward
// shadow, grey 20px icon, 15px label, 17px semibold time, 22px pause. Tap the label to go to the timer's step.
// A finished timer (shown whether or not the bar is switched on) uses alert colours and dark text and says what it was
// for; the alarm sounds at the same moment.
function TimerBar({ t, now, onGo, pause, resume, remove }: { t: Running; now: number; onGo: () => void } & Controls) {
  return (
    <div role={t.done ? 'alert' : undefined}
      className={`relative z-10 flex items-center gap-2 h-11 px-4 rounded-t-2xl shadow-[0_-2px_12px_rgba(0,0,0,0.15)] ${t.done ? 'bg-alert text-ink' : 'bg-white text-muted'}`}>
      <Icon name={t.done ? 'alarm' : 'timer'} size={20} />
      <button onClick={onGo} className={`flex-1 min-w-0 text-left truncate text-[15px] leading-[1.4] ${t.done ? 'font-semibold' : ''}`}>{t.done ? `Time's up: ${t.label}` : `${t.label} · step ${t.step}`}</button>
      <span className="font-semibold tabular-nums text-[17px] leading-[1.3]">{t.done ? 'Done' : fmt(leftOf(t, now))}</span>
      {t.done
        ? <button aria-label="Dismiss timer" onClick={() => remove(t.id)} className="w-6 h-6 grid place-items-center"><Icon name="close" size={22} /></button>
        : t.endsAt
          ? <button aria-label="Pause timer" onClick={() => pause(t.id)} className="w-6 h-6 grid place-items-center"><Icon name="pause" size={22} /></button>
          : <button aria-label="Resume timer" onClick={() => resume(t.id)} className="w-6 h-6 grid place-items-center"><Icon name="play_arrow" size={22} /></button>}
    </div>
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
