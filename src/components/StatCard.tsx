import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  unit?: string
  color?: string
  trend?: string
}

export function StatCard({ icon: Icon, label, value, unit, color = '#34d399', trend }: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm font-normal text-white/40 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  )
}
