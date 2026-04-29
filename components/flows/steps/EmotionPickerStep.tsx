'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { EMOTIONS } from '@/types'
import type { FlowStep } from '@/types'

interface Props {
  step: FlowStep
  onSubmit: (answer: string[]) => void
  loading?: boolean
}

export function EmotionPickerStep({ step, onSubmit, loading }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (e: string) =>
    setSelected((s) => s.includes(e) ? s.filter((x) => x !== e) : [...s, e])

  return (
    <div className="space-y-4">
      {step.hint && <p className="text-sm text-stone-400">{step.hint}</p>}
      <div className="flex flex-wrap gap-2">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion}
            onClick={() => toggle(emotion)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all cursor-pointer
              ${selected.includes(emotion)
                ? 'border-rose-200 bg-rose-100 text-rose-700 shadow-sm'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50'
              }`}
          >
            {emotion}
          </button>
        ))}
      </div>
      <Button
        onClick={() => onSubmit(selected)}
        disabled={selected.length === 0}
        loading={loading}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  )
}
