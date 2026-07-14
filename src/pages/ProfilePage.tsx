import { useState } from 'react'
import { User, Target, Droplets, Bell, Shield, ChevronRight, Edit3 } from 'lucide-react'
import type { useAppState } from '../hooks/useAppState'

type AppData = ReturnType<typeof useAppState>

interface ProfilePageProps {
  data: AppData
}

export function ProfilePage({ data }: ProfilePageProps) {
  const { state, currentWeight, bmi, updateProfile } = data
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(state.profile)

  const saveProfile = () => {
    updateProfile(form)
    setEditing(false)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <header className="text-center pt-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-accent mx-auto flex items-center justify-center text-3xl font-bold mb-3">
          {state.profile.name[0]}
        </div>
        <h1 className="text-2xl font-bold">{state.profile.name}</h1>
        <p className="text-white/50 text-sm">Участник FitPulse</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-lg font-bold">{currentWeight}</p>
          <p className="text-[10px] text-white/40">кг</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-lg font-bold">{state.profile.height}</p>
          <p className="text-[10px] text-white/40">см</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-lg font-bold">{bmi.toFixed(1)}</p>
          <p className="text-[10px] text-white/40">ИМТ</p>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Target size={18} className="text-brand-400" />
            Мои цели
          </h2>
          <button
            onClick={() => editing ? saveProfile() : setEditing(true)}
            className="text-brand-400 text-sm font-medium flex items-center gap-1"
          >
            <Edit3 size={14} />
            {editing ? 'Сохранить' : 'Изменить'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            <Field label="Имя" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <Field label="Возраст" value={form.age} type="number" onChange={v => setForm({ ...form, age: +v })} />
            <Field label="Рост (см)" value={form.height} type="number" onChange={v => setForm({ ...form, height: +v })} />
            <Field label="Целевой вес (кг)" value={form.targetWeight} type="number" onChange={v => setForm({ ...form, targetWeight: +v })} />
            <Field label="Калории/день" value={form.dailyCalorieGoal} type="number" onChange={v => setForm({ ...form, dailyCalorieGoal: +v })} />
            <Field label="Вода/день (мл)" value={form.dailyWaterGoal} type="number" onChange={v => setForm({ ...form, dailyWaterGoal: +v })} />
          </div>
        ) : (
          <div className="space-y-3">
            <GoalRow label="Целевой вес" value={`${state.profile.targetWeight} кг`} />
            <GoalRow label="Калории в день" value={`${state.profile.dailyCalorieGoal} ккал`} />
            <GoalRow label="Вода в день" value={`${state.profile.dailyWaterGoal} мл`} />
            <GoalRow label="Стартовый вес" value={`${state.profile.startWeight} кг`} />
            <GoalRow label="Серия" value={`${state.streak} дней 🔥`} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <MenuItem icon={Droplets} label="Напоминания о воде" sub="Каждые 2 часа" />
        <MenuItem icon={Bell} label="Уведомления" sub="Утренние и вечерние" />
        <MenuItem icon={Shield} label="Конфиденциальность" sub="Данные хранятся локально" />
        <MenuItem icon={User} label="О приложении" sub="FitPulse v1.0" />
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-white/40 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors"
      />
    </div>
  )
}

function GoalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function MenuItem({ icon: Icon, label, sub }: { icon: typeof User; label: string; sub: string }) {
  return (
    <button className="w-full glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center">
        <Icon size={18} className="text-white/60" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-white/40">{sub}</p>
      </div>
      <ChevronRight size={16} className="text-white/20" />
    </button>
  )
}
