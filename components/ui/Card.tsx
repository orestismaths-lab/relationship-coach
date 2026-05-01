import { type HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ padded = true, className = '', children, ...props }: Props) {
  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-white shadow-sm ${padded ? 'p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
