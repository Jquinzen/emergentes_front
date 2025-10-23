import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import type { LavanderiaType } from "../utils/LavanderiaType"
import ItemLavanderia from "./components/ItemLavanderia"
import { Search } from "lucide-react"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminLavanderias() {
  const [lavanderias, setLavanderias] = useState<LavanderiaType[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    async function getLavanderias() {
      try {
        setLoading(true)
        const r = await fetch(`${apiUrl}/lavanderias`)
        const d = await r.json()
        setLavanderias(Array.isArray(d) ? d : [])
      } finally {
        setLoading(false)
      }
    }
    getLavanderias()
  }, [])

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return lavanderias
    return lavanderias.filter(
      (l) =>
        l.nome?.toLowerCase().includes(q) ||
        l.endereco?.toLowerCase().includes(q)
    )
  }, [lavanderias, query])

  const linhas = filtradas.map((lav) => (
    <ItemLavanderia
      key={lav.id}
      lav={lav}
      lavanderias={lavanderias}
      setLavanderias={setLavanderias}
    />
  ))

  return (
    <div className="mt-24 px-6 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              Cadastro de Lavanderias
            </span>
          </h1>
          <p className="mt-1 text-slate-600 text-sm">
            Gerencie unidades, destaque e números de máquinas.
          </p>
        </div>

        <Link
          to="/admin/lavanderias/nova"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold
                     text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                     shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nova Lavanderia
        </Link>
      </div>

      {/* Busca */}
      <div className="mb-4 max-w-lg">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou endereço…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm
                       outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Tabela */}
      <div className="relative overflow-x-auto rounded-2xl shadow border border-slate-100 bg-white">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="text-xs uppercase bg-slate-50 border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wide">Foto</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Unidade</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Máquinas</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Destaque</th>
              <th className="px-6 py-4 font-semibold tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td className="px-6 py-6" colSpan={5}>
                  <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                </td>
              </tr>
            ) : filtradas.length > 0 ? (
              linhas
            ) : (
              <tr>
                <td className="px-6 py-10 text-center text-slate-500" colSpan={5}>
                  Nenhuma lavanderia encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
