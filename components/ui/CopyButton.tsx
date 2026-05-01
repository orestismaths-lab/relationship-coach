'use client'

import { useState } from 'react'

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback for non-secure contexts
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors cursor-pointer
        ${copied
          ? 'text-green-600'
          : 'text-stone-300 hover:text-stone-500'
        } ${className}`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 6 5 9 10 3" />
          </svg>
          <span>Copied</span>
        </>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <path d="M8 4V2.5A1.5 1.5 0 006.5 1h-5A1.5 1.5 0 000 2.5v5A1.5 1.5 0 001.5 9H3" />
        </svg>
      )}
    </button>
  )
}
