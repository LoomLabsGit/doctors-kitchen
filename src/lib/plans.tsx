import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { initialPlans, type Plan } from '../data/plans'

type PlansCtx = { plans: Plan[]; add: (p: Plan) => void; update: (id: string, fn: (p: Plan) => Plan) => void; remove: (id: string) => void }
const Ctx = createContext<PlansCtx>(null!)
export const usePlans = () => useContext(Ctx)

// Kept in this browser's localStorage so plans survive a reload. Clear the "dk-plans" key to get the mock plans back.
const KEY = 'dk-plans'
const load = (): Plan[] => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : initialPlans } catch { return initialPlans } }

export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(plans)) } catch { /* private mode: in memory only */ } }, [plans])
  return <Ctx.Provider value={{
    plans,
    add: (p) => setPlans((ps) => [...ps, p]),
    update: (id, fn) => setPlans((ps) => ps.map((p) => (p.id === id ? fn(p) : p))),
    remove: (id) => setPlans((ps) => ps.filter((p) => p.id !== id)),
  }}>{children}</Ctx.Provider>
}
