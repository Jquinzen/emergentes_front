import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ItemMaquina from "./components/ItemMaquina"
import type { MaquinaType } from "../utils/MaquinaType"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminMaquinas() {
  const [maquinas, setMaquinas] = useState<MaquinaType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getMaquinas() {
      try {
        setLoading(true)
        const token = localStorage.getItem("adminToken")
        const endpoint = token ? `${apiUrl}/maquinas/todas` : `${apiUrl}/maquinas`
        const response = await fetch(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!response.ok) throw new Error("Falha ao carregar máquinas")
        const dados = await response.json()
        setMaquinas(Array.isArray(dados) ? dados : [])
      } catch {
        setMaquinas([])
      } finally {
        setLoading(false)
      }
    }
    getMaquinas()
  }, [])

  const lista = maquinas.map((maq) => (
    <ItemMaquina key={maq.id} maquina={maq} maquinas={maquinas} setMaquinas={setMaquinas} />
  ))

  return (
    <div className="mx-4 mt-28 mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              Cadastro de Máquinas
            </span>
          </h1>
          <p className="mt-1 text-slate-600">
            Gerencie os equipamentos por lavanderia, endereço e status.
          </p>
          <div className="mt-3 h-1 w-36 rounded-full bg-gradient-to-r from-sky-500 to-teal-500" />
        </div>

        <Link
          to="/admin/maquinas/nova"
          className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 focus:ring-4 focus:ring-sky-300 font-semibold rounded-xl text-sm px-5 py-2.5 transition-shadow shadow-sm hover:shadow-md"
        >
          <span className="text-lg leading-none">＋</span>
          Nova Máquina
        </Link>
      </div>

      {/* Tabela */}
      <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-sky-100/80 bg-white shadow">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase text-slate-600/80 bg-white/80 backdrop-blur border-b border-sky-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Foto</th>
                <th className="px-6 py-3 font-semibold">Tipo</th>
                <th className="px-6 py-3 font-semibold">Lavanderia</th>
                <th className="px-6 py-3 font-semibold">Endereço</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-sky-100/60">
                      <td className="px-6 py-4"><div className="w-24 h-16 rounded-xl bg-sky-50 animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-28 rounded bg-slate-100 animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-40 rounded bg-slate-100 animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-56 rounded bg-slate-100 animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 rounded-full bg-slate-100 animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-14 rounded bg-slate-100 animate-pulse" /></td>
                    </tr>
                  ))}
                </>
              ) : maquinas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <div className="text-center">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-50 grid place-content-center text-sky-500 text-xl">🧺</div>
                      <h3 className="mt-3 text-slate-800 font-semibold">Nenhuma máquina encontrada</h3>
                      <p className="text-slate-600 text-sm mt-1">Clique em “Nova Máquina” para adicionar um equipamento.</p>
                      <div className="mt-4">
                        <Link
                          to="/admin/maquinas/nova"
                          className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 font-semibold rounded-xl text-sm px-4 py-2.5 shadow-sm hover:shadow"
                        >
                          <span className="text-base leading-none">＋</span>
                          Nova Máquina
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                lista
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
