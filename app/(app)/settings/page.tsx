import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">Settings</h1>
        <p className="text-sm text-stone-500">Manage your account preferences.</p>
      </div>

      {/* Account section */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Account</p>
        <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 shadow-sm">
          <SettingsRow label="Email" value={session?.user?.email ?? '—'} />
          <SettingsRow label="Name" value={session?.user?.name ?? '—'} />
          <SettingsRowButton label="Change password" action="Coming soon" />
          <SettingsRowButton label="Delete account" action="Coming soon" danger />
        </div>
      </section>

      {/* Privacy section */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Privacy</p>
        <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 shadow-sm">
          <SettingsRowButton label="Export my data" action="Coming soon" />
          <SettingsRowButton label="Delete all sessions" action="Coming soon" danger />
        </div>
      </section>

      {/* About section */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">About</p>
        <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 shadow-sm">
          <SettingsRow label="Version" value="MVP 0.1" />
          <SettingsRow label="AI mode" value={process.env.MOCK_AI === 'true' ? 'Mock (no API calls)' : `Live · ${process.env.AI_PROVIDER ?? 'anthropic'}`} />
        </div>
      </section>

      {/* Safety note */}
      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">Reminder:</span>{' '}
          This tool supports reflection only. It is not therapy, crisis support, legal advice,
          medical advice, or emergency help. If you are in crisis, contact{' '}
          <span className="font-semibold">988</span> (US) or{' '}
          <span className="font-semibold">116 123</span> (UK).
        </p>
      </div>
    </div>
  )
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-stone-700">{label}</span>
      <span className="text-sm text-stone-400">{value}</span>
    </div>
  )
}

function SettingsRowButton({
  label,
  action,
  danger,
}: {
  label: string
  action: string
  danger?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className={`text-sm ${danger ? 'text-red-500' : 'text-stone-700'}`}>{label}</span>
      <span className="text-xs text-stone-300">{action}</span>
    </div>
  )
}
