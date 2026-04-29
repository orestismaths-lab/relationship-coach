type Props = {
  label: string
  children: React.ReactNode
  accent?: 'indigo' | 'violet' | 'teal' | 'rose' | 'amber' | 'stone'
}

const accentStyles = {
  indigo: 'text-indigo-500',
  violet: 'text-violet-500',
  teal: 'text-teal-500',
  rose: 'text-rose-500',
  amber: 'text-amber-500',
  stone: 'text-stone-400',
}

export function ResultCard({ label, children, accent = 'stone' }: Props) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-2.5">
      <p className={`text-xs font-semibold uppercase tracking-widest ${accentStyles[accent]}`}>
        {label}
      </p>
      {children}
    </div>
  )
}

export function BulletList({ items, marker = '·' }: { items: string[]; marker?: string }) {
  if (!items.length) return null
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-stone-600 leading-relaxed">
          <span className="shrink-0 text-stone-300 mt-0.5">{marker}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ArrowList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm text-stone-600 leading-relaxed">
          <span className="shrink-0 text-stone-300 mt-0.5">→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Prose({ text }: { text: string }) {
  if (!text) return null
  return <p className="text-sm text-stone-700 leading-relaxed">{text}</p>
}

export function TwoColumn({ left, right, leftLabel, rightLabel }: {
  left: string[]
  right: string[]
  leftLabel: string
  rightLabel: string
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-stone-400">{leftLabel}</p>
        <BulletList items={left} />
      </div>
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-stone-400">{rightLabel}</p>
        <BulletList items={right} />
      </div>
    </div>
  )
}
