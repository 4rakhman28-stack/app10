import { useState, useEffect, useCallback } from 'react'
import type { AppState, UserProfile, MealEntry, WorkoutEntry } from '../types'

const STORAGE_KEY = 'fitpulse-state'

const defaultProfile: UserProfile = {
  name: 'Анна',
  age: 28,
  height: 168,
  startWeight: 78,
  targetWeight: 65,
  dailyCalorieGoal: 1600,
  dailyWaterGoal: 2500,
}

const generateWeightHistory = (): AppState['weightHistory'] => {
  const history: AppState['weightHistory'] = []
  const start = new Date()
  start.setDate(start.getDate() - 30)
  let weight = 78
  for (let i = 0; i <= 30; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    weight -= Math.random() * 0.15 + 0.05
    history.push({
      date: date.toISOString().split('T')[0],
      weight: Math.round(weight * 10) / 10,
    })
  }
  return history
}

const defaultState: AppState = {
  profile: defaultProfile,
  weightHistory: generateWeightHistory(),
  meals: [
    { id: '1', name: 'Овсянка с ягодами', calories: 320, protein: 12, carbs: 45, fat: 8, time: '08:30' },
    { id: '2', name: 'Куриная грудка с овощами', calories: 450, protein: 42, carbs: 15, fat: 18, time: '13:00' },
    { id: '3', name: 'Греческий йогурт', calories: 150, protein: 15, carbs: 12, fat: 4, time: '16:00' },
  ],
  workouts: [
    { id: '1', name: 'Утренняя пробежка', duration: 30, caloriesBurned: 280, date: new Date().toISOString().split('T')[0] },
  ],
  dailyStats: [],
  streak: 12,
  lastActiveDate: new Date().toISOString().split('T')[0],
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<AppState>
      if (parsed.profile && Array.isArray(parsed.meals) && Array.isArray(parsed.workouts)) {
        return { ...defaultState, ...parsed, profile: { ...defaultProfile, ...parsed.profile } }
      }
    }
  } catch {
    /* use defaults */
  }
  return defaultState
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const currentWeight = state.weightHistory.at(-1)?.weight ?? state.profile.startWeight

  const todayCalories = state.meals.reduce((sum, m) => sum + m.calories, 0)
  const todayBurned = state.workouts
    .filter(w => w.date === today())
    .reduce((sum, w) => sum + w.caloriesBurned, 0)

  const todayWater = state.dailyStats.find(d => d.date === today())?.waterMl ?? 1200

  const bmi = currentWeight / ((state.profile.height / 100) ** 2)

  const weightLost = state.profile.startWeight - currentWeight
  const weightToGo = currentWeight - state.profile.targetWeight
  const progressPercent = Math.min(
    100,
    Math.round((weightLost / (state.profile.startWeight - state.profile.targetWeight)) * 100)
  )

  const addMeal = useCallback((meal: Omit<MealEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      meals: [...prev.meals, { ...meal, id: crypto.randomUUID() }],
    }))
  }, [])

  const removeMeal = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      meals: prev.meals.filter(m => m.id !== id),
    }))
  }, [])

  const addWater = useCallback((ml: number) => {
    setState(prev => {
      const date = today()
      const existing = prev.dailyStats.find(d => d.date === date)
      const updated = existing
        ? prev.dailyStats.map(d => d.date === date ? { ...d, waterMl: d.waterMl + ml } : d)
        : [...prev.dailyStats, { date, caloriesConsumed: 0, caloriesBurned: 0, waterMl: ml, steps: 0 }]
      return { ...prev, dailyStats: updated }
    })
  }, [])

  const addWorkout = useCallback((workout: Omit<WorkoutEntry, 'id'>) => {
    setState(prev => ({
      ...prev,
      workouts: [...prev.workouts, { ...workout, id: crypto.randomUUID() }],
    }))
  }, [])

  const logWeight = useCallback((weight: number) => {
    setState(prev => ({
      ...prev,
      weightHistory: [...prev.weightHistory, { date: today(), weight }],
    }))
  }, [])

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }))
  }, [])

  return {
    state,
    currentWeight,
    todayCalories,
    todayBurned,
    todayWater,
    bmi,
    weightLost,
    weightToGo,
    progressPercent,
    addMeal,
    removeMeal,
    addWater,
    addWorkout,
    logWeight,
    updateProfile,
  }
}
