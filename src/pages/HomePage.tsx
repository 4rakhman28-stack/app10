import { Flame, Droplets, Footprints, Scale, Target, Zap } from 'lucide-react'
import { CircularProgress } from '../components/CircularProgress'
import { StatCard } from '../components/StatCard'
import type { useAppState } from '../hooks/useAppState'

type AppData = ReturnType<typeof useAppState>

interface HomePageProps {
  data: AppData
}

export function HomePage({ data }: HomePageProps) {
  const { state, currentWeight, todayCalories, todayBurned, todayWater, bmi, weightLost, progressPercent, addWater } = data
  const netCalories = todayCalories - todayBurned
  const calorieRemaining = state.profile.dailyCalorieGoal - netCalories

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Доброе утро'
    if (hour < 18) return 'Добрый день'
    return 'Добрый вечер'
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <header className="pt-2">
        <p className="text-white/50 text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold">{state.profile.name} 👋</h1>
      </header>

      <div className="glass-strong rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50 mb-1">Текущий вес</p>
            <p className="text-4xl font-extrabold gradient-text">{currentWeight} <span className="text-lg">кг</span></p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-brand-400 text-sm font-medium">
                <TrendingDownIcon />
                −{weightLost.toFixed(1)} кг
              </div>
              <div className="flex items-center gap-1 text-accent-light text-sm font-medium">
                <Zap size={14} />
                {state.streak} дней
              </div>
            </div>
          </div>
          <CircularProgress
            value={progressPercent}
            max={100}
            size={110}
            strokeWidth={7}
            color="#34d399"
            label={`${progressPercent}%`}
            sublabel="цель"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-white/8">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>{state.profile.startWeight} кг</span>
            <span className="text-brand-400 font-medium">Цель: {state.profile.targetWeight} кг</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Калории сегодня</h2>
          <span className="text-xs text-white/40">
            {calorieRemaining > 0 ? `Осталось ${calorieRemaining}` : `+${Math.abs(calorieRemaining)} сверх`}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <CircularProgress
            value={netCalories}
            max={state.profile.dailyCalorieGoal}
            size={90}
            strokeWidth={6}
            color="#f97316"
            label={`${netCalories}`}
            sublabel="ккал"
          />
          <div className="flex-1 space-y-2">
            <MacroBar label="Съедено" value={todayCalories} max={state.profile.dailyCalorieGoal} color="#f97316" />
            <MacroBar label="Сожжено" value={todayBurned} max={500} color="#8b5cf6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Droplets} label="Вода" value={todayWater} unit="мл" color="#3b82f6" trend={`${Math.round(todayWater / state.profile.dailyWaterGoal * 100)}%`} />
        <StatCard icon={Footprints} label="Шаги" value="8 432" unit="" color="#a78bfa" trend="+12%" />
        <StatCard icon={Scale} label="ИМТ" value={bmi.toFixed(1)} color="#34d399" />
        <StatCard icon={Target} label="До цели" value={data.weightToGo.toFixed(1)} unit="кг" color="#f472b6" />
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-sm flex items-center gap-2">
            <Droplets size={16} className="text-blue-400" />
            Выпить воды
          </p>
          <span className="text-xs text-white/40">{todayWater} / {state.profile.dailyWaterGoal} мл</span>
        </div>
        <div className="flex gap-2">
          {[200, 250, 500].map(ml => (
            <button
              key={ml}
              onClick={() => addWater(ml)}
              className="flex-1 glass rounded-xl py-2.5 text-sm font-medium hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
            >
              +{ml} мл
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Flame size={20} className="text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Совет дня</p>
            <p className="text-xs text-white/50 mt-0.5">
              Пейте стакан воды за 30 минут до еды — это поможет контролировать аппетит и ускорит метаболизм.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/50">{label}</span>
        <span className="font-medium">{value} ккал</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(value / max * 100, 100)}%`, background: color }}
        />
      </div>
    </div>
  )
}

function TrendingDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  )
}
