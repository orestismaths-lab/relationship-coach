import Link from 'next/link'

export function SafetyBanner({ message }: { message: string }) {
  return (
    <div className="space-y-5 animate-slide-up">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
          We paused here
        </p>
        <p
          className="text-sm text-amber-900 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
          }}
        />
      </div>
      <p className="text-sm text-stone-400 text-center">
        You can close this tab or{' '}
        <Link href="/dashboard" className="text-indigo-500 hover:underline">
          return to home
        </Link>
        .
      </p>
    </div>
  )
}
