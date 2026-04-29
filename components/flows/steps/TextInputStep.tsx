'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { FlowStep } from '@/types'

interface Props {
  step: FlowStep
  onSubmit: (answer: string) => void
  loading?: boolean
}

export function TextInputStep({ step, onSubmit, loading }: Props) {
  const [value, setValue] = useState('')
  const isEmpty = value.trim().length === 0

  return (
    <div className="space-y-4">
      {step.hint && (
        <p className="text-sm text-stone-400 leading-relaxed">{step.hint}</p>
      )}
      <textarea
        className="w-full rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-800 placeholder:text-stone-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none shadow-sm transition-colors"
        rows={4}
        placeholder={step.placeholder ?? 'Write here…'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <Button
        onClick={() => onSubmit(value.trim())}
        disabled={isEmpty}
        loading={loading}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  )
}
