import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import ItemAdmin from "./components/ItemAdmin"
import type { AdminType } from "../utils/AdminType"
import { Search, X, Filter } from "lucide-react"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminCadAdmin() {
  const [admins, setAdmins] = useState<AdminType[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [nivel, setNivel] = useState<string>("")

  useEffect(() => {
    async function getAdmins() {
      try {
        setLoading(true)
        const response = await fetch(`${apiUrl}/admins`)
        const dados = await response.json()
        setAdmins(Array.isArray(dados) ? dados : [])
      } finally {
        setLoading(false)
      }
    }
    getAdmins()
  }, [])

  const filteredAdmins = useMemo(() => {
    const q = query.trim().toLowerCase()
    const n = nivel.trim()
    return admins.filter((a) => {
      const matchesQuery =
        !q ||
        a.nome?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q)
      const matchesNivel = !n || String(a.nivel) === n
      return matchesQuery && matchesNivel
    })
  }, [admins, query, nivel])

const listaAdmins = filteredAdmins.map((admin) => (
  <ItemAdmin key={admin.id} adminLinha={admin} setAdmins={setAdmins} />
))

  function clearFilters() {
    setQuery("")
    setNivel("")
  }

  return (
    <div className="mt-24 px-6 pb-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
           <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
            Cadastro de Administradores
          </span>

          </h1>
          <p className="mt-1 text-slate-600 text-sm">
            Gerencie os administradores do sistema, seus níveis e permissões.
          </p>
        </div>

        <Link
          to="/admin/cadAdmin/novo"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold
           text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700
           focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
           shadow-sm hover:shadow-md transition cursor-pointer"

        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Admin
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou e-mail…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm
                       outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 transition"
              title="Limpar busca"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                       outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
          >
            <option value="">Todos os níveis</option>
            <option value="1">Nível 1</option>
            <option value="2">Nível 2</option>
            <option value="3">Nível 3</option>
            <option value="4">Nível 4</option>
            <option value="5">Nível 5</option>
          </select>
          <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto h-10 px-4 rounded-xl text-sm font-semibold
                       text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Contagem */}
      <div className="mb-3 text-xs text-slate-500">
        {loading ? "Carregando…" : `${filteredAdmins.length} resultado(s)`}
      </div>

      {/* Tabela */}
      <div className="relative overflow-x-auto rounded-2xl shadow border border-slate-100 bg-white">
        <table className="w-full text-sm text-left text-slate-700">
          <thead className="text-xs uppercase bg-slate-50 border-b border-slate-100 text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wide">Nome</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wide">E-mail</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wide">Nível</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wide text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td className="px-6 py-6" colSpan={4}>
                  <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                </td>
              </tr>
            ) : filteredAdmins.length > 0 ? (
              listaAdmins
            ) : (
              <tr>
                <td className="px-6 py-10 text-center text-slate-500" colSpan={4}>
                  Nenhum administrador encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
