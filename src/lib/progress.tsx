import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { initialLog, type LogEntry } from '../data/progress'

type ProgressCtx = {
  log: LogEntry[]
  add: (e: Omit<LogEntry, 'id'>) => void
  update: (id: string, fn: (e: LogEntry) => LogEntry) => void
  remove: (id: string) => void
}
const Ctx = createContext<ProgressCtx>(null!)
export const useProgress = () => useContext(Ctx)

// Kept in this browser's localStorage, like plans. Clear the "dk-progress" key to get the mock log back.
const KEY = 'dk-progress'
const load = (): LogEntry[] => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : initialLog() } catch { return initialLog() } }

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [log, setLog] = useState<LogEntry[]>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(log)) } catch { /* private mode: in memory only */ } }, [log])
  // Finishes "Calculating nutritional info…" when the earliest pending meal is due (survives a reload via readyAt).
  useEffect(() => {
    const due = log.filter((e) => e.readyAt).map((e) => e.readyAt!)
    if (!due.length) return
    const t = setTimeout(() => setLog((l) => l.map((e) => (e.readyAt && e.readyAt <= Date.now() ? { ...e, readyAt: undefined } : e))),
      Math.max(0, Math.min(...due) - Date.now()))
    return () => clearTimeout(t)
  }, [log])
  return <Ctx.Provider value={{
    log,
    add: (e) => setLog((l) => [...l, { ...e, id: `l-${Date.now()}` }]),
    update: (id, fn) => setLog((l) => l.map((e) => (e.id === id ? fn(e) : e))),
    remove: (id) => setLog((l) => l.filter((e) => e.id !== id)),
  }}>{children}</Ctx.Provider>
}
