import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

type DonutProps = {
  data: { x: string; y: number }[]
  title?: string
  subtitle?: string
  colors: string[]
  height?: number
}

export default function Donut({
  data,
  title,
  subtitle,
  colors,
  height = 360,
}: DonutProps) {
  const total = data.reduce((s, d) => s + (d.y || 0), 0)
  const chartData = data.map((d) => ({ name: d.x, value: d.y }))

  return (
    <div className="rounded-2xl bg-white border border-sky-100 shadow p-6">
      {title && <h2 className="font-semibold text-slate-900 mb-1">{title}</h2>}
      {subtitle && <p className="text-slate-600 text-sm mb-4">{subtitle}</p>}

      {/* Wrapper relativo para overlay central */}
      <div className="app-chart-center" style={{ height }}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 8, right: 36, bottom: 24, left: 36 }}>
            <defs>
              {colors.map((c, i) => (
                <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.75} />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              isAnimationActive
              animationDuration={700}
              label={false}
              labelLine={false}
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={`url(#grad-${i})`}
                  stroke="rgba(15,23,42,0.06)"
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(v: any, name: any) => [`${v}`, name]}
              contentStyle={{
                borderRadius: 12,
                borderColor: "rgba(14,165,233,.25)",
              }}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 10 }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Overlay central (HTML absoluto) */}
        <div className="app-chart-center-label">
          <span className="label-title">
            {title?.split(" ")[0] || "Total"}
          </span>
          <span className="label-value">
            {total.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  )
}
