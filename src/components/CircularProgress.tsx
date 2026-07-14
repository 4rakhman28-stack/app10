interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
}

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color = '#34d399',
  label,
  sublabel,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(value / max, 1)
  const offset = circumference * (1 - percent)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-xl font-bold">{label}</span>}
        {sublabel && <span className="text-xs text-white/50">{sublabel}</span>}
      </div>
    </div>
  )
}
