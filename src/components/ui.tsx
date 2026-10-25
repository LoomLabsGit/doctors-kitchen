import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Recipe } from '../data/recipes'

export const Photo = ({ hue, className = '' }: { hue: number; className?: string }) => (
  <div className={className} style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 78%), hsl(${hue + 30} 45% 55%))` }} />
)

export function Chip({ children, onClick, active, onRemove }: { children: ReactNode; onClick?: () => void; active?: boolean; onRemove?: () => void }) {
  return (
    <button onClick={onRemove ?? onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-[13px] ${active ? 'bg-chip text-chip-text border-chip-text/30' : 'border-line text-ink bg-white'}`}>
      {children}{onRemove && ' ×'}
    </button>
  )
}

export function PageTitle({ children, green = true }: { children: ReactNode; green?: boolean }) {
  return <h1 className={`px-4 text-[26px] font-semibold ${green ? 'text-brand' : ''}`}>{children}</h1>
}

// `corner` replaces the heart on the photo (Saved lists show a Delete pill there, or nothing).
export function RecipeRow({ r, corner }: { r: Recipe; corner?: ReactNode }) {
  return (
    <Link to={`/recipe/${r.slug}`} className="flex gap-3 px-4 py-2 items-start">
      <div className="relative w-[150px] h-[150px] shrink-0 rounded-lg overflow-hidden">
        <Photo hue={r.hue} className="w-full h-full" />
        {corner === undefined ? <span className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 grid place-items-center text-sm">♡</span> : corner}
        {r.isNew && <span className="absolute bottom-2 left-0 bg-brand text-white text-[11px] font-bold px-2 py-0.5">NEW!</span>}
      </div>
      <div className="flex-1 pt-1">
        <div className="font-semibold leading-tight text-[17px]">{r.title}</div>
        <div className="text-[13px] text-muted mt-2 space-y-1">
          <div>◷ {r.mins} mins</div><div>⌁ {r.ingredients} ingredients</div>
          {r.rating && <div><span className="text-amber-500">★</span> {r.rating}</div>}
        </div>
      </div>
      <span className="text-line self-center text-xl">›</span>
    </Link>
  )
}

export function Sheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 bg-black/50 flex items-end" onClick={onClose}>
      <div className="bg-white w-full rounded-t-2xl max-h-[85%] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-4 pt-4 pb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button aria-label="Close" onClick={onClose} className="text-xl text-muted">×</button>
        </div>
        <div className="overflow-y-auto px-4 pb-3">{children}</div>
        {footer && <div className="p-3 border-t border-line">{footer}</div>}
      </div>
    </div>
  )
}
