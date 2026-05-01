type AlertType = 'error' | 'success' | 'info' | 'warning'

const styles: Record<AlertType, string> = {
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  info: 'bg-stone-50 border-stone-200 text-stone-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
}

export function Alert({ type = 'info', children }: { type?: AlertType; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  )
}
