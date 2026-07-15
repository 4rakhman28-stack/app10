import { useState, type ReactNode } from 'react'
import { useAppState } from './hooks/useAppState'
import { BottomNav } from './components/BottomNav'
import { InstallBanner } from './components/InstallBanner'
import { HomePage } from './pages/HomePage'
import { NutritionPage } from './pages/NutritionPage'
import { ProgressPage } from './pages/ProgressPage'
import { WorkoutsPage } from './pages/WorkoutsPage'
import { ProfilePage } from './pages/ProfilePage'
import type { Tab } from './types'

function App() {
  const [tab, setTab] = useState<Tab>('home')
  const appData = useAppState()

  const pages: Record<Tab, ReactNode> = {
    home: <HomePage data={appData} />,
    nutrition: <NutritionPage data={appData} />,
    progress: <ProgressPage data={appData} />,
    workouts: <WorkoutsPage data={appData} />,
    profile: <ProfilePage data={appData} />,
  }

  return (
    <div className="relative min-h-dvh max-w-lg mx-auto">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-3xl" />
      </div>

      <InstallBanner />

      <main className="px-5 pt-2 pb-28">
        {pages[tab]}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
