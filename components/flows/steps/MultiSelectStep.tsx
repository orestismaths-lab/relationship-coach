'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { FlowStep } from '@/types'

interface Props {
  step: FlowStep
  onSubmit: (answer: string[]) => void
  loading?: boolean
}

export function MultiSelectStep({ step, onSubmit, loading }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (opt: string) =>
    setSelected((s) => s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt])

  return (
    <div className="space-y-4">
      {step.hint && <p className="text-sm text-stone-400 leading-relaxed">{step.hint}</p>}
      <div className="flex flex-wrap gap-2">
        {step.options?.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer
              ${selected.includes(opt)
                ? 'border-indigo-300 bg-indigo-600 text-white shadow-sm'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => onSubmit(selected)}
          disabled={selected.length === 0 && step.required}
          loading={loading}
          className="w-full"
        >
          Continue
        </Button>
        {!step.required && selected.length === 0 && (
          <button
            onClick={() => onSubmit([])}
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors py-1"
          >
            Skip this question
          </button>
        )}
      </div>
    </div>
  )
}
