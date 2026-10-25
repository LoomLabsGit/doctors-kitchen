import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'

const tabs = [
  ['/', 'Recipes', '☰'], ['/plan', 'Plan', '▦'], ['/progress', 'Progress', '▮'],
  ['/saved', 'Saved', '♡'], ['/learn', 'Learn', '▤'], ['/about', 'About', '◁'],
] as const

// Phone frame: 390 x 844 centred on desktop, full screen on a real phone.
export default function Shell() {
  const { pathname } = useLocation()
  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative bg-white w-full max-w-[390px] h-full max-h-[844px] flex flex-col overflow-hidden sm:rounded-[28px] sm:shadow-2xl">
        <header className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
          <Link to="/" className="font-bold text-[17px] tracking-tight">🥗 The Doctor's Kitchen</Link>
          {pathname === '/' && <Link to="/profile" className="text-sm text-brand border border-brand/40 rounded-full px-3 py-1">Profile</Link>}
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
        <nav className="shrink-0 border-t border-line grid grid-cols-6 pb-2 pt-1 bg-white">
          {tabs.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `flex flex-col items-center text-[11px] py-1 ${isActive ? 'text-brand font-semibold' : 'text-muted'}`}>
              <span className="text-lg leading-none">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
