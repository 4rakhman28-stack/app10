export type Tab = 'home' | 'nutrition' | 'progress' | 'workouts' | 'profile'

export interface UserProfile {
  name: string
  age: number
  height: number
  startWeight: number
  targetWeight: number
  dailyCalorieGoal: number
  dailyWaterGoal: number
}

export interface WeightEntry {
  date: string
  weight: number
}

export interface MealEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

export interface WorkoutEntry {
  id: string
  name: string
  duration: number
  caloriesBurned: number
  date: string
}

export interface DailyStats {
  date: string
  caloriesConsumed: number
  caloriesBurned: number
  waterMl: number
  steps: number
}

export interface AppState {
  profile: UserProfile
  weightHistory: WeightEntry[]
  meals: MealEntry[]
  workouts: WorkoutEntry[]
  dailyStats: DailyStats[]
  streak: number
  lastActiveDate: string
}
