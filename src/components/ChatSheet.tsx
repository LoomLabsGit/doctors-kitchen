import { useState } from 'react'
import { Icon, Sheet } from './ui'

// "Ask Dr Rupy" chat, opened from Recipe detail's chat card and from cook mode's sparkle button.
// Replies were not captured in the audit, so a sent question gets a placeholder answer.
export function ChatSheet({ title, initial, onClose }: { title: string; initial: string; onClose: () => void }) {
  const [q, setQ] = useState(initial)
  const [thread, setThread] = useState<string[]>([])
  const send = () => { if (q.trim()) { setThread([...thread, q.trim()]); setQ('') } }
  return (
    <Sheet title={`Ask Dr Rupy: ${title}`} onClose={onClose}>
      {thread.map((t, i) => (
        <div key={i} className="mb-3">
          <p className="ml-auto w-fit max-w-[85%] bg-brand-soft rounded-lg px-3 py-2">{t}</p>
          <p className="mt-2 w-fit max-w-[85%] bg-[#f1f1f1] rounded-lg px-3 py-2 text-muted italic">Dr Rupy's answer would appear here (not part of the prototype).</p>
        </div>
      ))}
      <form className="flex" onSubmit={(e) => { e.preventDefault(); send() }}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 min-w-0 border border-line rounded-l-md px-3 py-2.5 text-[17px]" />
        <button aria-label="Send" className="shrink-0 bg-brand text-white px-4 rounded-r-md grid place-items-center"><Icon name="send" size={22} fill /></button>
      </form>
      <p className="text-center text-[12px] text-muted mt-2">By using this service, you understand that it's an experimental feature and should not be construed as medical advice or diagnosis.</p>
    </Sheet>
  )
}
