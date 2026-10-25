import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Recipe } from '../data/recipes'
import { recipeStats } from '../data/progress'
import { useImproved } from '../lib/version'

// Google Material Symbols (Rounded), self-hosted from the material-symbols package. `name` is the symbol name,
// e.g. "schedule". Size is set inline because the package's own font-size rule outranks Tailwind utilities.
export const Icon = ({ name, size = '1.25em', fill, className = '' }: { name: string; size?: number | string; fill?: boolean; className?: string }) => (
  <span aria-hidden className={`material-symbols-rounded shrink-0 align-middle select-none ${className}`}
    style={{ fontSize: size, lineHeight: 1, fontVariationSettings: fill ? "'FILL' 1" : undefined }}>{name}</span>
)

export const Photo = ({ hue, className = '' }: { hue: number; className?: string }) => (
  <div className={className} style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 78%), hsl(${hue + 30} 45% 55%))` }} />
)

// Round white heart on recipe photos.
export const Heart = ({ className = 'top-2 right-2' }: { className?: string }) => (
  <span className={`absolute ${className} bg-white/90 rounded-full w-7 h-7 grid place-items-center text-ink`}><Icon name="favorite" size={18} /></span>
)

export function Chip({ children, onClick, active, onRemove }: { children: ReactNode; onClick?: () => void; active?: boolean; onRemove?: () => void }) {
  return (
    <button onClick={onRemove ?? onClick}
      className={`shrink-0 inline-flex items-center gap-0.5 rounded-full border px-3 py-1 text-[13px] ${active ? 'bg-chip text-chip-text border-chip-text/30' : 'border-line text-ink bg-white'}`}>
      {children}{onRemove && <Icon name="close" size={16} />}
    </button>
  )
}

export function PageTitle({ children, green = true }: { children: ReactNode; green?: boolean }) {
  return <h1 className={`px-4 text-[26px] font-semibold ${green ? 'text-brand' : ''}`}>{children}</h1>
}

// Time and ingredient count, with the clock and leaf icons the app uses.
export const Meta = ({ r, inline }: { r: Recipe; inline?: boolean }) => inline
  ? <span className="inline-flex items-center gap-1 flex-wrap">
      <span className="inline-flex items-center gap-1 whitespace-nowrap"><Icon name="schedule" size={15} />{r.mins} mins</span>·
      <span className="inline-flex items-center gap-1 whitespace-nowrap"><Icon name="eco" size={15} />{r.ingredients} ingredients</span>
    </span>
  : <><div className="flex items-center gap-1"><Icon name="schedule" size={16} />{r.mins} mins</div><div className="flex items-center gap-1"><Icon name="eco" size={16} />{r.ingredients} ingredients</div></>

export const Stars = ({ value }: { value: number }) => <span className="inline-flex items-center gap-0.5"><Icon name="star" size={16} fill className="text-amber-500" />{value}</span>

// IMPROVED (UX issue U5): protein and fibre on cards; `protein` highlights protein in High Protein lists.
export function Nutrition({ r, protein }: { r: Recipe; protein?: boolean }) {
  const s = recipeStats[r.slug]
  if (!s) return null
  return <div><span className={protein ? 'text-brand font-semibold' : ''}>Protein {s.protein}g</span> · Fibre {s.fibre}g</div>
}

// `corner` replaces the heart on the photo (Saved lists show a Delete pill there, or nothing).
// AS-IS (UX issue U5): no nutrition, and the rating line disappears on unrated recipes.
// IMPROVED: fixed slots (time and ingredients, rating or "No ratings yet", protein and fibre).
export function RecipeRow({ r, corner, protein }: { r: Recipe; corner?: ReactNode; protein?: boolean }) {
  const improved = useImproved()
  return (
    <Link to={`/recipe/${r.slug}`} className="flex gap-3 px-4 py-2 items-start">
      <div className="relative w-[150px] h-[150px] shrink-0 rounded-lg overflow-hidden">
        <Photo hue={r.hue} className="w-full h-full" />
        {corner === undefined ? <Heart /> : corner}
        {r.isNew && <span className="absolute bottom-2 left-0 bg-brand text-white text-[11px] font-bold px-2 py-0.5">NEW!</span>}
      </div>
      <div className="flex-1 pt-1">
        <div className="font-semibold leading-tight text-[17px]">{r.title}</div>
        <div className="text-[13px] text-muted mt-2 space-y-1">
          {improved ? <>
            <Meta r={r} />
            <div>{r.rating ? <Stars value={r.rating} /> : 'No ratings yet'}</div>
            <Nutrition r={r} protein={protein} />
          </> : <>
            <Meta r={r} />
            {r.rating && <div><Stars value={r.rating} /></div>}
          </>}
        </div>
      </div>
      <Icon name="chevron_right" size={26} className="text-line self-center" />
    </Link>
  )
}

export function Sheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 bg-black/50 flex items-end" onClick={onClose}>
      <div className="bg-white w-full rounded-t-2xl max-h-[85%] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center gap-3 px-4 pt-4 pb-2">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="text-muted grid place-items-center w-8 h-8 shrink-0"><Icon name="close" size={22} /></button>
        </div>
        <div className="overflow-y-auto px-4 pb-3">{children}</div>
        {footer && <div className="p-3 border-t border-line">{footer}</div>}
      </div>
    </div>
  )
}
