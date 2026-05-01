import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServerT } from '@/lib/i18n/server'
import { SaveHistoryToggle } from '@/components/settings/SaveHistoryToggle'
import { DeleteAllSessionsButton } from '@/components/settings/DeleteAllSessionsButton'
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm'
import { DeleteAccountButton } from '@/components/settings/DeleteAccountButton'
import { ExportButton } from '@/components/settings/ExportButton'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const t = await getServerT()

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-stone-900">{t.settings.title}</h1>
        <p className="text-sm text-stone-500">{t.settings.subtitle}</p>
      </div>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.settings.account}</p>
        <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 shadow-sm">
          <SettingsRow label={t.settings.email} value={session?.user?.email ?? '—'} />
          <SettingsRow label={t.settings.name} value={session?.user?.name ?? '—'} />
          <ChangePasswordForm />
          <DeleteAccountButton />
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.settings.privacy}</p>
        <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 shadow-sm">
          <SaveHistoryToggle />
          <ExportButton />
          <DeleteAllSessionsButton />
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.settings.about}</p>
        <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 shadow-sm">
          <SettingsRow label={t.settings.version} value="MVP 0.1" />
          <SettingsRow
            label={t.settings.aiMode}
            value={process.env.MOCK_AI === 'true' ? t.settings.mockMode : `Live · ${process.env.AI_PROVIDER ?? 'anthropic'}`}
          />
        </div>
      </section>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">{t.dashboard.safetyLabel}</span>{' '}
          {t.settings.safetyReminder}{' '}
          {t.settings.crisisNote}{' '}
          <span className="font-semibold">988</span> (US) ·{' '}
          <span className="font-semibold">116 123</span> (EU).
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

function SettingsRowButton({ label, action, danger }: { label: string; action: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className={`text-sm ${danger ? 'text-red-500' : 'text-stone-700'}`}>{label}</span>
      <span className="text-xs text-stone-300">{action}</span>
    </div>
  )
}
