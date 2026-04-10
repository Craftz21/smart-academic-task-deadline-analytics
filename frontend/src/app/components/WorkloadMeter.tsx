interface WorkloadMeterProps {
  score: number  // 0–100
}

export default function WorkloadMeter({ score }: WorkloadMeterProps) {
  const clipped = Math.min(100, Math.max(0, score))

  const color =
    clipped < 30 ? '#22c55e' :
    clipped < 60 ? '#f59e0b' :
    clipped < 80 ? '#f97316' :
                   '#ef4444'

  const label =
    clipped < 30 ? 'Light' :
    clipped < 60 ? 'Moderate' :
    clipped < 80 ? 'Heavy' :
                   'Critical'

  // SVG arc math for a semicircle gauge
  const r = 54
  const cx = 70, cy = 70
  const circumference = Math.PI * r          // half circle
  const dash = (clipped / 100) * circumference

  return (
    <div className="card flex flex-col items-center">
      <p className="text-sm font-medium text-slate-400 mb-3">Workload Score</p>
      <svg viewBox="0 0 140 80" className="w-40 h-24">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s' }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 2} textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="JetBrains Mono">
          {clipped}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={color} fontSize="10" fontWeight="500">
          {label}
        </text>
      </svg>
      <p className="text-xs text-slate-500 text-center mt-1 max-w-[160px]">
        Based on pending tasks, priorities &amp; deadlines
      </p>
    </div>
  )
}
