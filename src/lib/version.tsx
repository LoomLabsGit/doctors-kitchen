import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Which version of the prototype is showing: the app as it is today ("as-is", the default) or with the
// redesign fixes ("improved"). Each fix in the code checks `useImproved()` and keeps the as-is behaviour next to it.
// The choice is kept in localStorage ("dk-version"); a link with ?v=improved or ?v=as-is opens that version.
type Version = 'as-is' | 'improved'
const KEY = 'dk-version'

function initial(): Version {
  const fromUrl = new URLSearchParams(location.search).get('v') ?? new URLSearchParams(location.hash.split('?')[1] ?? '').get('v')
  if (fromUrl === 'improved' || fromUrl === 'as-is') return fromUrl
  try { return localStorage.getItem(KEY) === 'improved' ? 'improved' : 'as-is' } catch { return 'as-is' }
}

const Ctx = createContext<{ version: Version; setVersion: (v: Version) => void }>(null!)
export const useVersion = () => useContext(Ctx)
export const useImproved = () => useContext(Ctx).version === 'improved'

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<Version>(initial)
  useEffect(() => {
    try { localStorage.setItem(KEY, version) } catch { /* private mode: not kept */ }
    // Keep a ?v= in the address in step with the toggle, so a reload or a copied link shows the same version.
    const url = new URL(location.href)
    if (url.searchParams.has('v')) { url.searchParams.set('v', version); history.replaceState(history.state, '', url) }
  }, [version])
  return <Ctx.Provider value={{ version, setVersion }}>{children}</Ctx.Provider>
}
