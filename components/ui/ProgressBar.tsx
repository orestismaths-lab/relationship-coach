export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-end text-xs text-stone-400">
        <span>{current} / {total}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-stone-100">
        <div
          className="h-1 rounded-full bg-indigo-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
