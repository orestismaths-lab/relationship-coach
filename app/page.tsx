import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <span className="text-sm font-semibold tracking-tight text-stone-800">
            Relationship Coach
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3.5 py-1.5 text-sm text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto w-full max-w-3xl px-5 pt-20 pb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-4">
            Private · Guided · Structured
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
            Get clarity<br className="hidden sm:block" /> before you react.
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-lg mx-auto leading-relaxed">
            Relationship Coach helps you understand difficult relationship situations,
            prepare sensitive conversations, and choose healthier next steps.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* Flow Cards */}
        <section className="mx-auto w-full max-w-4xl px-5 pb-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FlowPreviewCard
              accent="indigo"
              label="Understand"
              title="Understand What Happened"
              description="For confusing moments, mixed signals, conflict, or emotional uncertainty."
              minutes={8}
            />
            <FlowPreviewCard
              accent="violet"
              label="Prepare"
              title="Prepare a Difficult Conversation"
              description="For sensitive messages, boundaries, apologies, feedback, or emotional honesty."
              minutes={10}
            />
            <FlowPreviewCard
              accent="teal"
              label="Decide"
              title="Decide My Next Step"
              description="For deciding whether to stay engaged, step back, ask for change, or set a boundary."
              minutes={7}
            />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-3xl px-5 pb-20">
          <div className="rounded-2xl border border-stone-200 bg-white p-8">
            <h2 className="text-base font-semibold text-stone-800 mb-6 text-center">
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { step: '1', title: 'Choose a flow', body: 'Pick the one that fits your situation right now.' },
                { step: '2', title: 'Answer guided questions', body: 'No blank chat. Structured prompts that help you think.' },
                { step: '3', title: 'Receive a reflection', body: 'Get a calm, structured summary — not advice, just clarity.' },
              ].map((item) => (
                <div key={item.step} className="space-y-2">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                    {item.step}
                  </div>
                  <p className="text-sm font-semibold text-stone-800">{item.title}</p>
                  <p className="text-sm text-stone-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Note */}
        <section className="mx-auto w-full max-w-2xl px-5 pb-20">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-2">Important</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              This tool supports reflection and communication. It is not therapy, crisis support,
              legal advice, medical advice, or emergency help.
            </p>
            <p className="mt-3 text-xs text-amber-600">
              If you are in crisis, contact a crisis line.{' '}
              <span className="font-semibold">US: 988</span> ·{' '}
              <span className="font-semibold">UK: 116 123</span>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6">
        <p className="text-center text-xs text-stone-400">
          Relationship Coach · Not therapy · Not emergency help
        </p>
      </footer>
    </div>
  )
}

function FlowPreviewCard({
  accent,
  label,
  title,
  description,
  minutes,
}: {
  accent: 'indigo' | 'violet' | 'teal'
  label: string
  title: string
  description: string
  minutes: number
}) {
  const accentStyles = {
    indigo: { badge: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-400' },
    violet: { badge: 'bg-violet-50 text-violet-600', dot: 'bg-violet-400' },
    teal:   { badge: 'bg-teal-50 text-teal-600',     dot: 'bg-teal-400'   },
  }
  const s = accentStyles[accent]

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}>{label}</span>
        <span className="text-xs text-stone-400">~{minutes} min</span>
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
        <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
      </div>
      <div className={`h-0.5 w-8 rounded-full ${s.dot}`} />
    </div>
  )
}
