import { useState } from 'react'
import { Plus, Trash2, Apple, Coffee, Moon } from 'lucide-react'
import type { useAppState } from '../hooks/useAppState'

type AppData = ReturnType<typeof useAppState>

interface NutritionPageProps {
  data: AppData
}

const quickMeals = [
  { name: 'Яблоко', calories: 95, protein: 0, carbs: 25, fat: 0 },
  { name: 'Банан', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Яйцо варёное', calories: 78, protein: 6, carbs: 1, fat: 5 },
  { name: 'Творог 5%', calories: 120, protein: 17, carbs: 3, fat: 5 },
  { name: 'Салат Цезарь', calories: 350, protein: 15, carbs: 12, fat: 28 },
  { name: 'Рис с курицей', calories: 420, protein: 35, carbs: 45, fat: 8 },
]

export function NutritionPage({ data }: NutritionPageProps) {
  const { state, todayCalories, addMeal, removeMeal } = data
  const [showAdd, setShowAdd] = useState(false)

  const totalProtein = state.meals.reduce((s, m) => s + m.protein, 0)
  const totalCarbs = state.meals.reduce((s, m) => s + m.carbs, 0)
  const totalFat = state.meals.reduce((s, m) => s + m.fat, 0)

  const handleQuickAdd = (meal: typeof quickMeals[0]) => {
    const now = new Date()
    addMeal({
      ...meal,
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
    })
    setShowAdd(false)
  }

  const mealTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    if (hour < 11) return Coffee
    if (hour < 17) return Apple
    return Moon
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold">Питание</h1>
        <p className="text-white/50 text-sm mt-1">
          {todayCalories} / {state.profile.dailyCalorieGoal} ккал
        </p>
      </header>

      <div className="glass-strong rounded-2xl p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-3xl font-extrabold">{todayCalories}</p>
            <p className="text-xs text-white/40">ккал сегодня</p>
          </div>
          <p className="text-sm text-brand-400 font-medium">
            {state.profile.dailyCalorieGoal - todayCalories > 0
              ? `Осталось ${state.profile.dailyCalorieGoal - todayCalories}`
              : 'Лимит превышен'}
          </p>
        </div>
        <div className="h-3 bg-white/8 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
            style={{ width: `${Math.min(todayCalories / state.profile.dailyCalorieGoal * 100, 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MacroPill label="Белки" value={totalProtein} unit="г" color="#34d399" goal={120} />
          <MacroPill label="Углеводы" value={totalCarbs} unit="г" color="#3b82f6" goal={180} />
          <MacroPill label="Жиры" value={totalFat} unit="г" color="#f472b6" goal={55} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Приёмы пищи</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Добавить
        </button>
      </div>

      {showAdd && (
        <div className="glass rounded-2xl p-4 space-y-2 animate-fade-in">
          <p className="text-sm text-white/50 mb-2">Быстрое добавление</p>
          <div className="grid grid-cols-2 gap-2">
            {quickMeals.map(meal => (
              <button
                key={meal.name}
                onClick={() => handleQuickAdd(meal)}
                className="glass rounded-xl p-3 text-left hover:bg-white/10 transition-colors"
              >
                <p className="text-sm font-medium">{meal.name}</p>
                <p className="text-xs text-white/40">{meal.calories} ккал</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {state.meals.map(meal => {
          const Icon = mealTimeIcon(meal.time)
          return (
            <div key={meal.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{meal.name}</p>
                <p className="text-xs text-white/40">
                  {meal.time} · Б {meal.protein}г · У {meal.carbs}г · Ж {meal.fat}г
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm">{meal.calories}</p>
                <p className="text-xs text-white/40">ккал</p>
              </div>
              <button
                onClick={() => removeMeal(meal.id)}
                className="text-white/20 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MacroPill({ label, value, unit, color, goal }: { label: string; value: number; unit: string; color: string; goal: number }) {
  return (
    <div className="text-center">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="font-bold" style={{ color }}>{value}{unit}</p>
      <div className="h-1 bg-white/8 rounded-full mt-1.5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(value / goal * 100, 100)}%`, background: color }} />
      </div>
    </div>
  )
}
