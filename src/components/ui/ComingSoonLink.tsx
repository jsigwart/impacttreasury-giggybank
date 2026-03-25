'use client'

import { useState, useRef, useEffect } from 'react'

interface ComingSoonLinkProps {
  children: React.ReactNode
  className?: string
}

export default function ComingSoonLink({ children, className = '' }: ComingSoonLinkProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShow(false), 2000)
    return () => clearTimeout(timer)
  }, [show])

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setShow(true)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-default text-gray-600 transition-colors hover:text-slate-900"
      >
        {children}
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          Coming Soon
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  )
}
