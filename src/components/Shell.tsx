import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { Icon } from './ui'
import { useVersion } from '../lib/version'

const tabs = [
  ['/', 'Recipes', 'format_list_bulleted'], ['/plan', 'Plan', 'calendar_month'], ['/progress', 'Progress', 'bar_chart'],
  ['/saved', 'Saved', 'favorite'], ['/learn', 'Learn', 'local_library'],
] as const

// Phone frame: 390 x 844 centred on desktop, full screen on a real phone.
export default function Shell() {
  const { pathname } = useLocation()
  return (
    <div className="h-full flex items-center justify-center">
      <VersionToggle />
      <div className="relative bg-white w-full max-w-[390px] h-full max-h-[844px] flex flex-col overflow-hidden sm:rounded-[28px] sm:shadow-2xl">
        <header className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
          <Link to="/" className="font-bold text-[17px] tracking-tight flex items-center gap-1"><Icon name="rice_bowl" size={24} />The Doctor's Kitchen</Link>
          {pathname === '/' && <Link to="/profile" className="text-sm text-brand border border-brand/40 rounded-full px-3 py-1">Profile</Link>}
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
        <nav className="shrink-0 border-t border-line grid grid-cols-5 pb-2 pt-1 bg-white">
          {tabs.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[11px] py-1 ${isActive ? 'text-brand font-semibold' : 'text-muted'}`}>
              {({ isActive }) => <><Icon name={icon} size={24} fill={isActive} />{label}</>}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}

// Switches between the app as it is today and the redesign. Outside the phone frame on desktop; a small
// floating pill above the bottom bar on a phone, so it never looks like part of the app's own screens.
function VersionToggle() {
  const { version, setVersion } = useVersion()
  return (
    <div className="fixed z-50 right-2 bottom-[72px] sm:bottom-auto sm:top-4 sm:right-4 flex bg-white rounded-full shadow-lg border border-line p-0.5 text-[12px] sm:text-[14px]">
      {(['as-is', 'improved'] as const).map((v) => (
        <button key={v} onClick={() => setVersion(v)} aria-pressed={version === v}
          className={`rounded-full px-2.5 sm:px-4 py-1 ${version === v ? 'bg-ink text-white' : 'text-muted'}`}>{v === 'as-is' ? 'As-is' : 'Improved'}</button>
      ))}
    </div>
  )
}
