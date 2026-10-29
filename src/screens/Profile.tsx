import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { allergens, recipes } from '../data/recipes'
import { Heart, Icon, Photo } from '../components/ui'

// Food and notification preferences are kept in this browser's localStorage when Update is pressed ("dk-profile").
const KEY = 'dk-profile'
type Prefs = { diet: string; goals: string[]; allergens: string[]; likes: string[]; dislikes: string[]; types: string[]; extra: string[]; nutrition: boolean; notify: Record<string, boolean> }
const DEFAULTS: Prefs = {
  diet: 'I eat everything', goals: ['Improve gut health'], allergens: ['Gluten'], likes: [], dislikes: ['Coriander'], types: [], extra: [], nutrition: true,
  notify: { seasonal: true, eat: false, product: true, ideas: true, news: true, activity: true, partners: false, general: true },
}
const load = (): Prefs => { try { const s = localStorage.getItem(KEY); return s ? { ...DEFAULTS, ...JSON.parse(s) } : DEFAULTS } catch { return DEFAULTS } }
const save = (p: Prefs) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* private mode: not kept */ } }

const UpdateBtn = ({ onClick, floating }: { onClick: () => void; floating?: boolean }) => (
  <div className={`text-center ${floating ? 'sticky bottom-3 z-10 mt-8' : 'mt-6'}`}>
    <button onClick={onClick} className="bg-brand text-white rounded-lg px-7 py-2 text-[17px] shadow-md">Update</button>
  </div>
)

export function ProfileHome() {
  const rows: [string, string, string][] = [
    ['person', 'Account info', '/profile/account'], ['checklist', 'Food preferences', '/profile/food'], ['notifications', 'Notification preferences', '/profile/notifications'],
    ['credit_card', 'Premium subscription', '/profile/subscription'], ['stars', 'Virtual Dr Rupy chats', '/profile/chats'],
  ]
  return (
    <div className="pb-6">
      <h1 className="px-4 text-[26px] font-semibold">Profile</h1>
      <div className="mx-4 mt-2 divide-y divide-line/60">
        {rows.map(([icon, name, to]) => <Link key={to} to={to} className="flex items-center px-4 py-3 text-brand text-[19px]"><Icon name={icon} size={24} fill className="mr-3" />{name}<Icon name="chevron_right" size={24} /></Link>)}
        {/* Log out was deliberately not exercised in the audit: left inert */}
        <span className="flex items-center px-4 py-3 text-brand text-[19px]"><Icon name="logout" size={24} className="mr-3" />Log out<Icon name="chevron_right" size={24} /></span>
      </div>
    </div>
  )
}

// The Your details screens were left out of docs/screens on purpose (they showed a real name and email), so this is a placeholder.
export function ProfileAccount() {
  return (
    <div className="pb-6 px-4">
      <h1 className="text-[26px] font-semibold">Account info</h1>
      <p className="text-muted mt-3">Not built: the reference screens were removed because they showed personal details. Delete account is out of scope.</p>
    </div>
  )
}

const Choice = ({ children, on, onClick }: { children: ReactNode; on: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`block w-full rounded-lg py-2 text-[17px] shadow-[0_1px_6px_rgba(0,0,0,0.08)] ${on ? 'bg-[#6b8fdc] text-white' : 'bg-white text-brand'}`}>{children}</button>
)

// UX issue Profile !1: three Update buttons on one page (after diet, after goals, and a floating one), and it is
// unclear which section each saves. Here every one of them saves the whole page. Feedback after Update was not captured.
export function FoodPreferences() {
  const [p, setP] = useState(load)
  const set = (x: Partial<Prefs>) => setP({ ...p, ...x })
  const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v])
  const goals = [['🔥', 'Reduce inflammation'], ['🧠', 'Improve cognitive function'], ['⚡', 'Have more energy'], ['👌', 'Improve general wellbeing'],
    ['🦠', 'Improve gut health'], ['❤️', 'Improve heart health'], ['🌸', 'Improve menopause symptoms'], ['💪', 'Build muscle'], ['⚖️', 'Manage my weight']]
  return (
    <div className="px-4 pb-4">
      <h1 className="text-[26px] font-semibold">Your food preferences</h1>
      <h2 className="font-semibold text-[19px] mt-3">Dietary Requirements</h2>
      <div className="space-y-2 mt-2">
        {[['😋', 'I eat everything'], ['🐟', 'Pescatarian'], ['🥕', 'Vegan'], ['🥗', 'Vegetarian']].map(([i, d]) =>
          <Choice key={d} on={p.diet === d} onClick={() => set({ diet: d })}>{i} {d}</Choice>)}
      </div>
      <UpdateBtn onClick={() => save(p)} />
      <h2 className="font-semibold text-[19px] mt-6">Health goals</h2>
      <p className="font-semibold text-[15px] mt-1">I want to…</p>
      <div className="space-y-2 mt-2">
        {goals.map(([i, g]) => <Choice key={g} on={p.goals.includes(g)} onClick={() => set({ goals: toggle(p.goals, g) })}>{i} {g}</Choice>)}
      </div>
      <UpdateBtn onClick={() => save(p)} />
      <Tags title="Allergens" value={p.allergens} onChange={(v) => set({ allergens: v })} options={allergens} />
      <Tags title="Ingredient likes" value={p.likes} onChange={(v) => set({ likes: v })} placeholder="Search for ingredients..." />
      <Tags title="Ingredient dislikes" value={p.dislikes} onChange={(v) => set({ dislikes: v })} placeholder="Search for ingredients..." />
      <Tags title="Types of recipes you enjoy" value={p.types} onChange={(v) => set({ types: v })} />
      <Tags title="Your additional goals" value={p.extra} onChange={(v) => set({ extra: v })} />
      <label className="flex items-center justify-center gap-2 mt-8 text-[17px]">
        <input type="checkbox" checked={p.nutrition} onChange={(e) => set({ nutrition: e.target.checked })} className="accent-[#12a676] w-5 h-5" />Show recipe nutrition information
      </label>
      <UpdateBtn floating onClick={() => save(p)} />
    </div>
  )
}

// A box of removable tags with an input for adding more (a picker when `options` is given).
function Tags({ title, value, onChange, options, placeholder = '' }: { title: string; value: string[]; onChange: (v: string[]) => void; options?: string[]; placeholder?: string }) {
  const [q, setQ] = useState('')
  const add = (v: string) => { const t = v.trim(); if (t && !value.includes(t)) onChange([...value, t]); setQ('') }
  return (
    <div className="mt-6">
      <h2 className="font-semibold text-[19px]">{title}</h2>
      <div className="mt-2 border border-line rounded-md p-2 flex flex-wrap gap-2 min-h-[46px]">
        {value.map((v) => <button key={v} onClick={() => onChange(value.filter((x) => x !== v))} className="inline-flex items-center gap-1 border border-line rounded px-2 py-1 text-[17px]"><Icon name="close" size={18} />{v}</button>)}
        {options
          ? <select value="" onChange={(e) => add(e.target.value)} className="flex-1 min-w-[120px] text-muted bg-white">
              <option value="" disabled>{value.length ? 'Add…' : 'Select…'}</option>
              {options.filter((o) => !value.includes(o)).map((o) => <option key={o}>{o}</option>)}
            </select>
          : <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(q) }} placeholder={value.length ? '' : placeholder} className="flex-1 min-w-[120px] outline-none" />}
      </div>
    </div>
  )
}

// UX issue Profile !3: "DK news and offers", "Offers from our partners" and "General news and offers" overlap in meaning.
const NOTIFY: [string, string, string][] = [
  ['seasonal', "'Seasonal Sundays' newsletter", 'Seasonal ingredient ideas with a weekly helping of health science, history and recipes'],
  ['eat', "'Eat, Listen, Read' newsletter", "Dr Rupy's personal newsletter with recipes and ideas for a healthier week"],
  ['product', 'Product updates', 'The latest features and app tips'],
  ['ideas', 'Recipe and meal plan ideas', 'New recipes and meal plan suggestions every week'],
  ['news', 'DK news and offers', "Member offers, events and what's new at DK HQ"],
  ['activity', 'Your activity', 'Personal recommendations, milestones and messages to help you reach your goals'],
  ['partners', 'Offers from our partners', 'Discounts from selected health and wellness brands'],
  ['general', 'General news and offers', 'Membership discounts, health and wellness news and cooking tips'],
]

// UX issue Profile !2: the Update button floats over the content as you scroll.
export function NotificationPreferences() {
  const [p, setP] = useState(load)
  return (
    <div className="px-4 pb-4">
      <h1 className="text-[26px] font-semibold">Your notification preferences</h1>
      <div className="divide-y divide-line/70">
        {NOTIFY.map(([k, t, d]) => (
          <div key={k} className="py-4">
            <h2 className="text-[22px] font-semibold">{t}</h2>
            <p className="text-[16px] mt-1">{d}</p>
            <label className="flex items-center gap-2 mt-2 text-[17px]">
              <input type="checkbox" checked={p.notify[k]} onChange={(e) => setP({ ...p, notify: { ...p.notify, [k]: e.target.checked } })} className="accent-[#12a676] w-5 h-5" />Email
            </label>
          </div>
        ))}
      </div>
      <UpdateBtn floating onClick={() => save(p)} />
    </div>
  )
}

// Mock complimentary subscription. UX issue Profile !4: dates in two formats (07/09/2027 and 7th Sep 2027), shown in UTC.
export function Subscription() {
  const rows = [['settings', 'Payment platform', 'Complimentary'], ['payments', 'Current period', 'Active'], ['event', 'Subscribed since', '07/09/2026']]
  return (
    <div className="px-4 pb-6">
      <h1 className="text-[26px] font-semibold">Your subscription</h1>
      <div className="mt-3 space-y-3 text-[18px]">
        {rows.map(([i, k, v]) => <div key={k} className="flex justify-between"><span className="flex items-center"><Icon name={i} size={22} fill className="text-brand mr-2" />{k}</span><span className="text-muted">{v}</span></div>)}
        <div className="flex justify-between"><span className="flex items-center"><Icon name="sync" size={22} className="text-brand mr-2" />Ends at</span><span className="text-muted text-right">15:42<br />07/09/2027 <span className="text-[13px]">UTC</span></span></div>
      </div>
      <div className="mt-8 bg-[#d5ecf1] text-[#1d5f77] rounded px-4 py-4 text-center text-[17px]">
        Your complimentary subscription is due to end on 7th Sep 2027 - to avoid losing access to the app, purchase a subscription now!
        {/* Purchases are out of scope: left inert */}
        <div className="mt-3"><span className="inline-block bg-brand text-white rounded-lg px-6 py-2">Buy a subscription</span></div>
      </div>
    </div>
  )
}

// Past AI chats, one row per question, linked to the recipe. Summaries are made up.
const CHATS: [string, string][] = [
  ['chickpea-herb-salad', 'virtual Dr Rupy explained why the salad is a good source of fibre and plant protein.'],
  ['lentil-roast-veg-soup', 'virtual Dr Rupy suggested swaps for the roast veg and how to freeze leftovers.'],
  ['strawberry-chia-pudding', 'virtual Dr Rupy converted the milk measurement from millilitres to cups.'],
  ['crispy-sumac-chicken', 'virtual Dr Rupy explained how to keep the chicken crisp when batch cooking.'],
  ['sri-lankan-cashew-curry', 'virtual Dr Rupy clarified that the sauce quantities are for two servings.'],
  ['sri-lankan-cashew-curry', 'virtual Dr Rupy suggested a milder chilli for younger eaters.'],
  ['sri-lankan-cashew-curry', 'virtual Dr Rupy explained whether the cashews can be swapped for seeds.'],
]
export function ChatHistory() {
  const bySlug = Object.fromEntries(recipes.map((r) => [r.slug, r]))
  return (
    <div className="pb-6">
      <h1 className="px-4 text-[26px] font-semibold">Virtual Dr Rupy chat history</h1>
      {CHATS.map(([slug, text], n) => {
        const r = bySlug[slug]
        return (
          <Link key={n} to={`/recipe/${slug}`} className="flex gap-3 px-4 py-2 items-start">
            <div className="relative w-[112px] h-[112px] shrink-0 rounded-lg overflow-hidden">
              <Photo hue={r.hue} src={r.image} className="w-full h-full" />
              <Heart />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[17px] truncate">{r.title}</div>
              <div className="text-[14px] leading-snug line-clamp-4">{text}</div>
            </div>
            <Icon name="chevron_right" size={26} className="text-line self-center" />
          </Link>
        )
      })}
    </div>
  )
}
