export default function Stub({ name, folder }: { name: string; folder: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-brand">{name}</h1>
      <p className="mt-3 text-muted text-sm">Not built yet. Reference screenshots: <code>docs/screens/{folder}</code>. Issues: <code>docs/ISSUES.md</code>.</p>
    </div>
  )
}
