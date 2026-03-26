'use client'

import { useState, useRef, useEffect } from 'react'

interface ComingSoonLinkProps {
  children: React.ReactNode
  className?: string
  position?: 'above' | 'below'
}

export default function ComingSoonLink({ children, className = '', position = 'above' }: ComingSoonLinkProps) {
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
        <span className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg ${position === 'below' ? 'top-full mt-2' : 'bottom-full mb-2'}`}>
          Coming Soon
          <span className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${position === 'below' ? 'bottom-full border-b-slate-800' : 'top-full border-t-slate-800'}`} />
        </span>
      )}
    </span>
  )
}
