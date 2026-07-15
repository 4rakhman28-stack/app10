import { Download, X } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function InstallBanner() {
  const { visible, showHelp, isIosDevice, install, dismiss } = useInstallPrompt()

  if (!visible) return null

  return (
    <div className="px-5 pt-4 pb-1">
      <div className="glass-strong rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent flex items-center justify-center">
            <Download size={18} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Установите FitPulse</p>
            <p className="text-white/45 text-xs">Быстрый доступ с главного экрана</p>
          </div>

          <button
            onClick={() => void install()}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold transition-colors"
          >
            Установить
          </button>

          <button
            onClick={dismiss}
            className="shrink-0 p-1 text-white/30 hover:text-white/60"
            aria-label="Закрыть"
          >
            <X size={16} />
          </button>
        </div>

        {showHelp && (
          <p className="mt-3 pt-3 border-t border-white/10 text-white/50 text-xs leading-relaxed">
            {isIosDevice
              ? 'Нажмите «Поделиться» в Safari, затем «На экран Домой».'
              : 'В Chrome: иконка «Установить» справа в адресной строке, или меню ⋮ → «Установить FitPulse».'}
          </p>
        )}
      </div>
    </div>
  )
}
