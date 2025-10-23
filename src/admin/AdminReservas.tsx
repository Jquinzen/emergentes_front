import { useEffect, useMemo, useState } from "react"
import type { ReservaType } from "../utils/ReservaType"
import ItemReserva from "./components/ItemReserva"
import { FiFilter, FiSearch, FiRefreshCw } from "react-icons/fi"

const apiUrl = import.meta.env.VITE_API_URL
type Status = "TODAS" | "PENDENTE" | "CONFIRMADA" | "RECUSADA" | "CANCELADA"

export default function AdminReservas() {
  const [reservas, setReservas] = useState<ReservaType[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // UI state
  const [statusFilter, setStatusFilter] = useState<Status>("TODAS")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function getReservas() {
      try {
        setErro(null)
        setLoading(true)
        const response = await fetch(`${apiUrl}/reservas`)
        const dados = await response.json()
        setReservas(Array.isArray(dados) ? dados : [])
      } catch {
        setErro("Não foi possível carregar as reservas.")
      } finally {
        setLoading(false)
      }
    }
    getReservas()
  }, [])

  // KPIs simples
  const counts = useMemo(() => {
    const base = { TODAS: reservas.length, PENDENTE: 0, CONFIRMADA: 0, RECUSADA: 0, CANCELADA: 0 }
    reservas.forEach((r) => {
      if (r.status in base) (base as any)[r.status]++
    })
    return base
  }, [reservas])

  // filtro aplicado
  const reservasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase()
    return reservas.filter((r) => {
      const byStatus = statusFilter === "TODAS" ? true : r.status === statusFilter
      if (!byStatus) return false
      if (!q) return true
      const nomeLav = r.maquina?.lavanderia?.nome?.toLowerCase() || ""
      const endLav = r.maquina?.lavanderia?.endereco?.toLowerCase() || ""
      const maquinaTipo = r.maquina?.tipo?.toLowerCase() || ""
      return nomeLav.includes(q) || endLav.includes(q) || maquinaTipo.includes(q) || String(r.id).includes(q)
    })
  }, [reservas, statusFilter, search])

  const listaReservas = reservasFiltradas.map((res) => (
    <ItemReserva key={res.id} reserva={res as any} reservas={reservas as any} setReservas={setReservas as any} />
  ))

  if (loading) {
    return (
      <div className="mt-28 px-4 max-w-7xl mx-auto">
        <Header />
        <div className="rounded-2xl bg-white border border-sky-100 shadow p-6 mt-4">
          <div className="h-10 w-64 bg-sky-50 rounded animate-pulse" />
          <div className="mt-4 h-64 bg-sky-50 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="mt-28 px-4 max-w-7xl mx-auto">
        <Header />
        <div className="rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-200 p-6 mt-4">
          {erro}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-28 px-4 max-w-7xl mx-auto">
      <Header />

      {/* Filtros */}
      <div className="mt-4 rounded-2xl bg-white border border-sky-100 shadow p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600">
            <FiFilter className="opacity-70" />
            <span className="text-sm">Filtrar por status:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["TODAS", "PENDENTE", "CONFIRMADA", "RECUSADA", "CANCELADA"] as Status[]).map((s) => {
              const active = statusFilter === s
              const badge =
                s === "PENDENTE"
                  ? "bg-amber-50 text-amber-700 ring-amber-200"
                  : s === "CONFIRMADA"
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : s === "RECUSADA"
                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                  : s === "CANCELADA"
                  ? "bg-slate-100 text-slate-700 ring-slate-200"
                  : "bg-sky-50 text-sky-700 ring-sky-200"

              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-sm ring-1 transition ${badge} ${
                    active ? "ring-2" : "opacity-90 hover:opacity-100"
                  }`}
                >
                  {s === "TODAS" ? "Todas" : s.charAt(0) + s.slice(1).toLowerCase()} ({(counts as any)[s]})
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:w-80">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por lavanderia, endereço, tipo ou ID…"
              className="w-full rounded-xl border-sky-100 bg-white pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400 transition"
            />
            <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                title="Limpar"
              >
                <FiRefreshCw />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="mt-4 rounded-2xl bg-white border border-sky-100 shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-slate-600">
            <thead className="bg-sky-50/60 text-slate-700 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Foto</th>
                <th className="px-6 py-3">Lavanderia / Máquina</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Período</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Mensagem</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="[&>tr:hover]:bg-sky-50/40">{listaReservas}</tbody>
          </table>
        </div>

        {reservasFiltradas.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhuma reserva encontrada para os filtros atuais.
          </div>
        )}
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="mb-2">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
        <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
          Controle de Reservas
        </span>
      </h1>
      <p className="mt-1 text-slate-600">
        Aprove e gerencie solicitações de forma rápida e organizada.
      </p>
      <div className="mt-3 h-1.5 w-40 rounded-full bg-gradient-to-r from-sky-500 to-teal-500" />
    </header>
  )
}
