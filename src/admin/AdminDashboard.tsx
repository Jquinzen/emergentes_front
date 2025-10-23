// AdminDashboard.tsx
import "./AdminDashboard.css"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label,
} from "recharts"
import {
  FiTrendingUp,
  // FiRefreshCw,
  // FiCheckCircle,
  // FiAlertCircle,
  FiServer,
} from "react-icons/fi"

const apiUrl = import.meta.env.VITE_API_URL

type GrafLavanderia = { lavanderia: string; num: number }
type GrafReservaStatus = {
  status: "PENDENTE" | "CONFIRMADA" | "RECUSADA" | "CANCELADA"
  num: number
}

type Geral = {
  clientes: number
  lavanderias: number
  maquinas: number
  reservas: number
}

export default function AdminDashboard() {
  const [maquinasLavanderia, setMaquinasLavanderia] = useState<GrafLavanderia[]>([])
  const [reservasStatus, setReservasStatus] = useState<GrafReservaStatus[]>([])
  const [dados, setDados] = useState<Geral | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        setErro(null)
        setLoading(true)

        const [rGerais, rLav, rRes] = await Promise.all([
          fetch(`${apiUrl}/dashboard/gerais`),
          fetch(`${apiUrl}/dashboard/maquinasLavanderia`),
          fetch(`${apiUrl}/dashboard/reservasStatus`),
        ])

        if (!rGerais.ok || !rLav.ok || !rRes.ok) {
          throw new Error("Falha ao buscar dados do dashboard")
        }

        const [dadosGerais, dadosLav, dadosRes] = await Promise.all([
          rGerais.json(),
          rLav.json(),
          rRes.json(),
        ])

        setDados(dadosGerais as Geral)
        setMaquinasLavanderia(Array.isArray(dadosLav) ? dadosLav : [])
        setReservasStatus(Array.isArray(dadosRes) ? dadosRes : [])
      } catch (e: any) {
        setErro(e?.message ?? "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  // prepara dados para os gráficos
  const pizzaMaquinasLavanderia = useMemo(
    () => maquinasLavanderia.map((i) => ({ x: i.lavanderia, y: i.num })),
    [maquinasLavanderia]
  )
  const pizzaReservasStatus = useMemo(
    () => reservasStatus.map((i) => ({ x: i.status, y: i.num })),
    [reservasStatus]
  )

  // Paleta alinhada à navbar (sky/teal)
  const colorScaleLav = ["#0ea5e9", "#38bdf8", "#22d3ee", "#14b8a6", "#2dd4bf", "#0d9488"]
  const colorScaleStatus: Record<GrafReservaStatus["status"], string> = {
    PENDENTE: "#f59e0b",   // amber-500
    CONFIRMADA: "#14b8a6", // teal-500
    RECUSADA: "#ef4444",   // red-500
    CANCELADA: "#64748b",  // slate-500
  }

  /* ===========================
     Loading / Error States
  ============================ */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <main className="flex-grow pt-28 px-4 pb-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="h-8 w-72 rounded-xl bg-sky-200/70 animate-pulse" />
            <div className="mt-2 h-4 w-80 rounded bg-teal-100/70 animate-pulse" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/80 backdrop-blur border border-sky-100 p-5 shadow-sm">
                <div className="h-4 w-24 bg-sky-100 rounded animate-pulse mb-3" />
                <div className="h-8 w-16 bg-teal-100 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-sky-100 shadow p-6">
              <div className="h-72 bg-sky-50 rounded-xl animate-pulse" />
            </div>
            <div className="rounded-2xl bg-white border border-sky-100 shadow p-6">
              <div className="h-72 bg-sky-50 rounded-xl animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <main className="flex-grow pt-28 px-4 pb-10 max-w-7xl mx-auto">
          <div className="rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-200 p-6">
            <p className="font-semibold">Não foi possível carregar o dashboard.</p>
            <p className="text-sm opacity-80 mt-1">{erro}</p>
          </div>
        </main>
      </div>
    )
  }

  /* ===========================
     Dashboard
  ============================ */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 text-slate-800 dark:text-gray-100">
      <main className="flex-grow pt-28 px-4 pb-12 max-w-7xl mx-auto">
        {/* Título */}
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Painel do{" "}
            <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              Administrador
            </span>
          </h1>
          <p className="mt-1 text-slate-600">
            Visão geral de clientes, lavanderias, máquinas e reservas.
          </p>
          <div className="mt-3 h-1.5 w-40 rounded-full bg-gradient-to-r from-sky-500 to-teal-500" />
        </motion.header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Clientes"     value={dados?.clientes ?? 0}     note="Total cadastrados"       icon={<FiTrendingUp />} />
          <StatCard title="Lavanderias" value={dados?.lavanderias ?? 0}  note="Ativas no sistema"       icon={<FiServer />} />
          <StatCard title="Máquinas"    value={dados?.maquinas ?? 0}     note="Disponíveis p/ reserva"  icon={<FiServer />} />
          <StatCard title="Reservas"    value={dados?.reservas ?? 0}     note="Acumulado geral"         icon={<FiTrendingUp />} />
        </section>

        {/* Gráficos */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Máquinas por Lavanderia */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {pizzaMaquinasLavanderia.length === 0 ? (
              <VazioGrafico />
            ) : (
              <Donut
                data={pizzaMaquinasLavanderia}
                title="Máquinas por Lavanderia"
                subtitle="Distribuição de máquinas entre as unidades cadastradas."
                colors={colorScaleLav}
              />
            )}
          </motion.div>

          {/* Reservas por Status */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
            {pizzaReservasStatus.length === 0 ? (
              <VazioGrafico />
            ) : (
              <Donut
                data={pizzaReservasStatus}
                title="Reservas por Status"
                subtitle="Acompanhamento das reservas por situação atual."
                colors={[
                  colorScaleStatus.PENDENTE,
                  colorScaleStatus.CONFIRMADA,
                  colorScaleStatus.RECUSADA,
                  colorScaleStatus.CANCELADA,
                ]}
              />
            )}
          </motion.div>
        </section>
      </main>
    </div>
  )
}

/* ===================== */
/* ===== Components ==== */
/* ===================== */

function StatCard({
  title,
  value,
  note,
  icon,
}: {
  title: string
  value: number | string
  note?: string
  icon?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl bg-white border border-sky-100 p-5 shadow hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <div className="text-sky-600">{icon}</div>
      </div>
      <div className="mt-1 text-3xl font-medium text-slate-900">{value}</div>
      {note && <p className="mt-1 text-xs text-slate-600">{note}</p>}
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 to-teal-500" />
    </motion.div>
  )
}

function VazioGrafico() {
  return (
    <div className="h-[360px] rounded-2xl bg-white border border-sky-100 shadow p-6 flex items-center justify-center">
      <div className="text-slate-600">Sem dados suficientes.</div>
    </div>
  )
}

/* ===================== */
/* ===== Donut Chart === */
/* ===================== */

type DonutProps = {
  data: { x: string; y: number }[]
  title?: string
  subtitle?: string
  colors: string[]
  height?: number
}

function Donut({ data, title, subtitle, colors, height = 360 }: DonutProps) {
  const total = data.reduce((s, d) => s + (d.y || 0), 0)
  const chartData = data.map((d) => ({ name: d.x, value: d.y }))

  return (
    <div className="rounded-2xl bg-white border border-sky-100 shadow p-6">
      {title && <h2 className="font-semibold text-slate-900 mb-1">{title}</h2>}
      {subtitle && <p className="text-slate-600 text-sm mb-4">{subtitle}</p>}

      <div className="w-full" style={{ height }}>
        <ResponsiveContainer>
          <PieChart>
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
              labelLine
              label={(p) => {
                const pct = total ? Math.round((p.value as number) * 100 / total) : 0
                return `${p.name} • ${pct}%`
              }}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={`url(#grad-${i})`} stroke="rgba(15,23,42,0.06)" />
              ))}
              <Label
                position="center"
                content={() => (
                  <g>
                    <text x="50%" y="44%" textAnchor="middle" fill="#0ea5e9" fontWeight={800} fontSize={14}>
                      {title?.split(" ")[0] || "Total"}
                    </text>
                    <text x="50%" y="58%" textAnchor="middle" fill="#0f172a" fontWeight={800} fontSize={22}>
                      {total}
                    </text>
                  </g>
                )}
              />
            </Pie>

            <Tooltip
              formatter={(v: any, name: any) => [`${v}`, name]}
              contentStyle={{ borderRadius: 12, borderColor: "rgba(14,165,233,.25)" }}
            />
            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
