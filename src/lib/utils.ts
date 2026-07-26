import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export const PIPELINE_STAGES = [
  { key: 'PROSPECT', label: 'Prospect', color: 'bg-slate-400', border: 'border-slate-400', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400' },
  { key: 'TARGET', label: 'Target', color: 'bg-navy-800', border: 'border-navy-800', bg: 'bg-navy-800/5', text: 'text-navy-800', dot: 'bg-navy-800' },
  { key: 'VISIT_1', label: 'Visit 1', color: 'bg-brand-500', border: 'border-brand-500', bg: 'bg-brand-50', text: 'text-brand-600', dot: 'bg-brand-500' },
  { key: 'VISIT_2', label: 'Visit 2', color: 'bg-brand-600', border: 'border-brand-600', bg: 'bg-brand-100', text: 'text-brand-700', dot: 'bg-brand-600' },
  { key: 'VISIT_3', label: 'Visit 3', color: 'bg-brand-700', border: 'border-brand-700', bg: 'bg-brand-100', text: 'text-brand-700', dot: 'bg-brand-700' },
  { key: 'PRESENTATION', label: 'Presentasi', color: 'bg-cyan-400', border: 'border-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-600', dot: 'bg-cyan-400' },
  { key: 'PROPOSAL', label: 'Proposal', color: 'bg-accent-500', border: 'border-accent-500', bg: 'bg-accent-50', text: 'text-accent-600', dot: 'bg-accent-500' },
  { key: 'MOU', label: 'MOU', color: 'bg-success-500', border: 'border-success-500', bg: 'bg-success-50', text: 'text-success-600', dot: 'bg-success-500' },
  { key: 'NOT_THIS_TIME', label: 'Not This Time', color: 'bg-danger-500', border: 'border-danger-500', bg: 'bg-danger-50', text: 'text-danger-600', dot: 'bg-danger-500' },
] as const

export type PipelineStageKey = typeof PIPELINE_STAGES[number]['key']

export function getPipelineStage(key: string) {
  return PIPELINE_STAGES.find(s => s.key === key) || PIPELINE_STAGES[0]
}

export const PIPELINE_ACTIVE_STAGES = PIPELINE_STAGES.filter(s => s.key !== 'MOU' && s.key !== 'NOT_THIS_TIME').map(s => s.key)

export const MAX_PIPELINE = 20
