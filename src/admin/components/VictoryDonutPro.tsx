import  { useMemo } from "react"
import {
  VictoryPie,
  VictoryLabel,
  VictoryLegend,
  VictoryTooltip,
} from "victory"

type Datum = { x: string; y: number }

type Props = {
  data: Datum[]                
  title?: string             
  subtitle?: string          
 
  colors: string[]            
  height?: number          
}

export default function VictoryDonutPro({
  data,
  title,
  subtitle,
  colors,
  height = 380,
}: Props) {
  const total = useMemo(
    () => data.reduce((s, d) => s + (d.y || 0), 0),
    [data]
  )

  // mapa de cores/gradientes por índice
  const fillByIndex = (i: number) => `url(#slice-grad-${i})`

  // rótulo do tooltip
  const tooltipLabel = ({ datum }: { datum: any }) => {
    const pct = total ? Math.round((datum.y * 100) / total) : 0
    return `${datum.x}\n${datum.y} • ${pct}%`
  }

  // largura responsiva usando viewBox
  const width = 560 
  const pieSize = 380
  const centerX = width / 2
  const centerY = 210

  return (
    <div className="rounded-2xl bg-white border border-sky-100 shadow p-6">
      {title && <h2 className="font-semibold text-slate-900 mb-1">{title}</h2>}
      {subtitle && <p className="text-slate-600 text-sm mb-4">{subtitle}</p>}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ overflow: "visible" }}
      >
        {/* ======= Defs: gradientes e sombra ======= */}
        <defs>
          {/* sombra sutil nos arcos */}
          <filter id="arcShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.18" />
          </filter>

          {/* gradiente por fatia */}
          {colors.map((c, i) => (
            <linearGradient key={i} id={`slice-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={0.95} />
              <stop offset="100%" stopColor={c} stopOpacity={0.75} />
            </linearGradient>
          ))}
        </defs>

        {/* ======= Donut ======= */}
        <g transform={`translate(${centerX}, ${centerY})`} filter="url(#arcShadow)">
          <VictoryPie
            standalone={false}
            data={data}
            width={pieSize}
            height={pieSize}
            innerRadius={95}
            padAngle={2.2}
            cornerRadius={8}
            labels={() => ""} 
            startAngle={90}
            endAngle={-270}
            animate={{ duration: 800, easing: "quadInOut" }}
            labelComponent={
              <VictoryTooltip
                flyoutPadding={{ top: 8, bottom: 8, left: 10, right: 10 }}
                flyoutStyle={{
                  fill: "rgba(255,255,255,0.95)",
                  stroke: "rgba(14,165,233,0.35)",
                  strokeWidth: 1,
                }}
                style={{
                  fill: "#0f172a",
                  fontWeight: 600,
                  fontSize: 12,
                  fontFamily: "Inter, system-ui, Arial, sans-serif",
                  lineHeight: 1.2,
                }}
                constrainToVisibleArea
              />
            }
            labelRadius={120}
            labelPosition="centroid"
            x="x"
            y="y"
            colorScale={colors} 
            style={{
              data: {
                // aplica gradiente + borda sutil
                fill: ({ index }: any) => fillByIndex(index),
                stroke: "rgba(2,6,23,0.06)",
                strokeWidth: 1,
              },
            }}
         
            labels={tooltipLabel}
          />

          {/* centro: título + total */}
          <VictoryLabel
            text={title ? title.split(" ")[0] : "Total"}
            x={0}
            y={-6}
            textAnchor="middle"
            style={{
              fill: "#0ea5e9",
              fontSize: 13,
              fontWeight: 800,
              fontFamily: "Inter, system-ui, Arial, sans-serif",
            }}
          />
          <VictoryLabel
            text={`${total}`}
            x={0}
            y={18}
            textAnchor="middle"
            style={{
              fill: "#0f172a",
              fontSize: 26,
              fontWeight: 800,
              fontFamily: "Inter, system-ui, Arial, sans-serif",
            }}
          />
        </g>

        {/* ======= Legenda ======= */}
        <foreignObject x={0} y={height - 80} width={width} height={80}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <VictoryLegend
              standalone={false}
              orientation="horizontal"
              gutter={24}
              itemsPerRow={Math.min(data.length, 4)}
              x={width / 2 - (Math.min(data.length, 4) * 120) / 2}
              style={{
                labels: {
                  fontSize: 12,
                  fill: "#0f172a",
                  fontFamily: "Inter, system-ui, Arial, sans-serif",
                },
              }}
              data={data.map((d, i) => ({
                name: d.x,
                symbol: { fill: `url(#slice-grad-${i})`, type: "square", size: 10 },
              }))}
            />
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}
