// Plain local dates as 'YYYY-MM-DD' strings, so plans never shift with time zones.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const parseIso = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const todayIso = () => toIso(new Date())
export const addDays = (s: string, n: number) => { const d = parseIso(s); d.setDate(d.getDate() + n); return toIso(d) }
export const weekday = (s: string) => parseIso(s).toLocaleDateString('en-GB', { weekday: 'long' })
export const ordinal = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')

// "25th - 29th October", or "28th September - 2nd October" across months (as the live app writes it).
export function dateRange(start: string, days: number) {
  const s = parseIso(start), e = parseIso(addDays(start, days - 1))
  return s.getMonth() === e.getMonth()
    ? `${ordinal(s.getDate())} - ${ordinal(e.getDate())} ${MONTHS[e.getMonth()]}`
    : `${ordinal(s.getDate())} ${MONTHS[s.getMonth()]} - ${ordinal(e.getDate())} ${MONTHS[e.getMonth()]}`
}
