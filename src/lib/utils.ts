import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMMM d, yyyy')
}

export function formatDateShort(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy')
}

export function generateSlug(title: string, date: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 50)
  // e.g. "2026-03-10" → "260310"
  const dateCompact = date.replace(/-/g, '').slice(2)
  return `${base}-${dateCompact}`
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

export const CATEGORIES = ['food', 'transport', 'supplies', 'other'] as const

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    food: 'Food',
    transport: 'Transport',
    supplies: 'Supplies',
    other: 'Other',
  }
  return map[category] ?? category
}

export const CAMPAIGN_TYPES = ['high_tip_drop', 'cause_drop'] as const

export function campaignTypeLabel(type: string): string {
  const map: Record<string, string> = {
    high_tip_drop: 'High-Tip Drop',
    cause_drop: 'Cause Drop',
  }
  return map[type] ?? type
}
