type Props = {
  score: number
  size?: number
  stroke?: number
}

export function ScoreCircle({ score, size = 120, stroke = 10 }: Props) {
  const percentage = score * 10

  const radius = size / 2
  const normalizedRadius = radius - stroke
  const circumference = normalizedRadius * 2 * Math.PI

  const strokeDashoffset =
    circumference - (percentage / 100) * circumference

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg height={size} width={size}>
        <circle
          stroke="#240934"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.6s ease"
          }}
        />

        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stopColor="#de80f6" />
            <stop offset="100%" stopColor="#ba3aed" />
          </linearGradient>
        </defs>
      </svg>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontWeight: "bold",
          fontSize: size / 4
        }}
      >
        {score.toFixed(1)}
      </div>
    </div>
  )
}