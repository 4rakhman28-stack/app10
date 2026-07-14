import { useState, useEffect } from 'react'
import { Play, Clock, Flame, Check, Timer } from 'lucide-react'
import type { useAppState } from '../hooks/useAppState'

type AppData = ReturnType<typeof useAppState>

interface WorkoutsPageProps {
  data: AppData
}

const workoutPrograms = [
  {
    id: 'hiit',
    name: 'HIIT сжигание',
    duration: 20,
    calories: 250,
    difficulty: 'Средний',
    emoji: '🔥',
    color: '#f97316',
    exercises: ['Burpees × 30 сек', 'Планка × 45 сек', 'Прыжки × 30 сек', 'Приседания × 45 сек'],
  },
  {
    id: 'yoga',
    name: 'Йога для начинающих',
    duration: 30,
    calories: 120,
    difficulty: 'Лёгкий',
    emoji: '🧘',
    color: '#8b5cf6',
    exercises: ['Разминка шеи', 'Поза кошки-коровы', 'Поза воина', 'Шavasana'],
  },
  {
    id: 'cardio',
    name: 'Кардио-прогулка',
    duration: 45,
    calories: 300,
    difficulty: 'Лёгкий',
    emoji: '🏃',
    color: '#34d399',
    exercises: ['Быстрая ходьба 15 мин', 'Лёгкий бег 15 мин', 'Заминка 15 мин'],
  },
  {
    id: 'strength',
    name: 'Силовая тренировка',
    duration: 35,
    calories: 220,
    difficulty: 'Сложный',
    emoji: '💪',
    color: '#3b82f6',
    exercises: ['Приседания × 15', 'Отжимания × 12', 'Выпады × 10', 'Планка × 60 сек'],
  },
]

export function WorkoutsPage({ data }: WorkoutsPageProps) {
  const { state, todayBurned, addWorkout } = data
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const todayWorkouts = state.workouts.filter(w => w.date === new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  const startWorkout = (id: string) => {
    setActiveWorkout(id)
    setTimer(0)
    setIsRunning(true)
  }

  const completeWorkout = (program: typeof workoutPrograms[0]) => {
    addWorkout({
      name: program.name,
      duration: program.duration,
      caloriesBurned: program.calories,
      date: new Date().toISOString().split('T')[0],
    })
    setActiveWorkout(null)
    setIsRunning(false)
    setTimer(0)
  }

  const active = workoutPrograms.find(w => w.id === activeWorkout)

  if (active && isRunning) {
    const mins = Math.floor(timer / 60)
    const secs = timer % 60
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="text-center pt-8">
          <span className="text-5xl">{active.emoji}</span>
          <h1 className="text-2xl font-bold mt-3">{active.name}</h1>
          <p className="text-white/50 text-sm">{active.difficulty}</p>
        </div>

        <div className="flex justify-center py-6">
          <div className="relative">
            <div className="w-48 h-48 rounded-full border-4 border-white/10 flex items-center justify-center animate-pulse-ring">
              <div className="text-center">
                <p className="text-5xl font-extrabold tabular-nums">
                  {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
                </p>
                <p className="text-xs text-white/40 mt-1">/ {active.duration}:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 space-y-2">
          {active.exercises.map((ex, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs font-bold text-white/40">
                {i + 1}
              </div>
              <p className="text-sm">{ex}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 glass rounded-xl py-3.5 font-medium flex items-center justify-center gap-2"
          >
            <Timer size={18} />
            {isRunning ? 'Пауза' : 'Продолжить'}
          </button>
          <button
            onClick={() => completeWorkout(active)}
            className="flex-1 bg-brand-500 hover:bg-brand-600 rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Check size={18} />
            Завершить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold">Тренировки</h1>
        <p className="text-white/50 text-sm mt-1">Сожжено сегодня: {todayBurned} ккал</p>
      </header>

      <div className="glass-strong rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center">
          <Flame size={28} className="text-orange-400" />
        </div>
        <div>
          <p className="text-2xl font-bold">{todayBurned}</p>
          <p className="text-xs text-white/40">ккал сожжено сегодня</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-bold">{todayWorkouts.length}</p>
          <p className="text-xs text-white/40">тренировок</p>
        </div>
      </div>

      <h2 className="font-semibold">Программы</h2>
      <div className="space-y-3">
        {workoutPrograms.map(program => (
          <div key={program.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${program.color}20` }}
            >
              {program.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{program.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                <span className="flex items-center gap-1"><Clock size={12} /> {program.duration} мин</span>
                <span className="flex items-center gap-1"><Flame size={12} /> {program.calories} ккал</span>
                <span>{program.difficulty}</span>
              </div>
            </div>
            <button
              onClick={() => startWorkout(program.id)}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              style={{ background: `${program.color}30`, color: program.color }}
            >
              <Play size={18} fill="currentColor" />
            </button>
          </div>
        ))}
      </div>

      {todayWorkouts.length > 0 && (
        <>
          <h2 className="font-semibold">Сегодня</h2>
          <div className="space-y-2">
            {todayWorkouts.map(w => (
              <div key={w.id} className="glass rounded-xl p-3 flex items-center gap-3">
                <Check size={16} className="text-brand-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{w.name}</p>
                  <p className="text-xs text-white/40">{w.duration} мин · {w.caloriesBurned} ккал</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
