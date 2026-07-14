import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Scale, TrendingDown, Calendar, Award } from 'lucide-react'
import type { useAppState } from '../hooks/useAppState'

type AppData = ReturnType<typeof useAppState>

interface ProgressPageProps {
  data: AppData
}

export function ProgressPage({ data }: ProgressPageProps) {
  const { state, currentWeight, weightLost, weightToGo, progressPercent, bmi, logWeight } = data
  const [newWeight, setNewWeight] = useState('')
  const [showInput, setShowInput] = useState(false)

  const chartData = state.weightHistory.slice(-14).map(entry => ({
    date: new Date(entry.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    weight: entry.weight,
  }))

  const handleLogWeight = () => {
    const w = parseFloat(newWeight)
    if (w > 30 && w < 300) {
      logWeight(w)
      setNewWeight('')
      setShowInput(false)
    }
  }

  const bmiCategory = () => {
    if (bmi < 18.5) return { label: 'Недостаточный', color: '#3b82f6' }
    if (bmi < 25) return { label: 'Норма', color: '#34d399' }
    if (bmi < 30) return { label: 'Избыточный', color: '#f97316' }
    return { label: 'Ожирение', color: '#ef4444' }
  }

  const bmiInfo = bmiCategory()

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold">Прогресс</h1>
        <p className="text-white/50 text-sm mt-1">Отслеживайте свой путь</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-4 col-span-1">
          <Scale size={18} className="text-brand-400 mb-2" />
          <p className="text-2xl font-bold">{currentWeight}</p>
          <p className="text-xs text-white/40">кг сейчас</p>
        </div>
        <div className="glass rounded-2xl p-4 col-span-1">
          <TrendingDown size={18} className="text-brand-400 mb-2" />
          <p className="text-2xl font-bold text-brand-400">−{weightLost.toFixed(1)}</p>
          <p className="text-xs text-white/40">кг сброшено</p>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm">Динамика веса</h2>
          <button
            onClick={() => setShowInput(!showInput)}
            className="text-xs text-brand-400 font-medium hover:text-brand-300 transition-colors"
          >
            + Записать вес
          </button>
        </div>

        {showInput && (
          <div className="flex gap-2 mb-4 animate-fade-in">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={e => setNewWeight(e.target.value)}
              placeholder="Вес в кг"
              className="flex-1 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors"
            />
            <button
              onClick={handleLogWeight}
              className="bg-brand-500 hover:bg-brand-600 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              OK
            </button>
          </div>
        )}

        <div className="h-48 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontSize: 13,
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#34d399"
                strokeWidth={2.5}
                fill="url(#weightGrad)"
                dot={{ fill: '#34d399', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#34d399' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold text-sm mb-4">Достижения</h2>
        <div className="grid grid-cols-3 gap-3">
          <Achievement icon={Award} label="−5 кг" unlocked={weightLost >= 5} />
          <Achievement icon={Calendar} label="7 дней" unlocked={state.streak >= 7} />
          <Achievement icon={TrendingDown} label="−10 кг" unlocked={weightLost >= 10} />
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Индекс массы тела</h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${bmiInfo.color}20`, color: bmiInfo.color }}>
            {bmiInfo.label}
          </span>
        </div>
        <p className="text-3xl font-extrabold mb-3">{bmi.toFixed(1)}</p>
        <div className="relative h-2 bg-white/8 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-blue-500/30" />
            <div className="flex-1 bg-green-500/30" />
            <div className="flex-1 bg-orange-500/30" />
            <div className="flex-1 bg-red-500/30" />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg border-2 border-brand-400 transition-all"
            style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>15</span><span>20</span><span>25</span><span>30</span><span>40</span>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <div className="text-center flex-1">
          <p className="text-2xl font-bold gradient-text">{progressPercent}%</p>
          <p className="text-xs text-white/40">выполнено</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center flex-1">
          <p className="text-2xl font-bold">{weightToGo.toFixed(1)}</p>
          <p className="text-xs text-white/40">кг до цели</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center flex-1">
          <p className="text-2xl font-bold">{state.streak}</p>
          <p className="text-xs text-white/40">дней подряд</p>
        </div>
      </div>
    </div>
  )
}

function Achievement({ icon: Icon, label, unlocked }: { icon: typeof Award; label: string; unlocked: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center transition-all ${unlocked ? 'glass-strong' : 'opacity-30'}`}>
      <Icon size={24} className={`mx-auto mb-1.5 ${unlocked ? 'text-yellow-400' : 'text-white/30'}`} />
      <p className="text-xs font-medium">{label}</p>
    </div>
  )
}
