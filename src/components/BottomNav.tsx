import type { Tab } from '../types'
import { Home, Utensils, TrendingDown, Dumbbell, User } from 'lucide-react'

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Главная' },
  { id: 'nutrition', icon: Utensils, label: 'Питание' },
  { id: 'progress', icon: TrendingDown, label: 'Прогресс' },
  { id: 'workouts', icon: Dumbbell, label: 'Спорт' },
  { id: 'profile', icon: User, label: 'Профиль' },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="glass-strong rounded-2xl flex items-center justify-around py-2 max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-brand-400' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-400" />
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
