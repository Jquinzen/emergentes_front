import { toast } from "sonner"
import type { MaquinaType } from "../../utils/MaquinaType"

const apiUrl = import.meta.env.VITE_API_URL

type Props = {
  maquina: MaquinaType
  maquinas: MaquinaType[]
  setMaquinas: (lista: MaquinaType[]) => void
}

export default function ItemMaquina({ maquina, maquinas, setMaquinas }: Props) {
  async function toggleAtiva(id: number) {
    try {
      const response = await fetch(`${apiUrl}/maquinas/ativar/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (response.ok) {
        const atualizada: MaquinaType = await response.json()
        const novaLista = maquinas.map((m) => (m.id === id ? { ...m, ativa: atualizada.ativa } : m))
        setMaquinas(novaLista)
        toast.success(`Máquina ${atualizada.ativa ? "ativada" : "desativada"}`)
      } else {
        const err = await response.json().catch(() => ({}))
        toast.error(err?.erro ?? "Erro ao atualizar status")
      }
    } catch {
      toast.error("Erro de conexão")
    }
  }

  async function excluirMaquina(id: number) {
    if (!confirm("Deseja realmente excluir esta máquina do sistema?")) return
    try {
      const response = await fetch(`${apiUrl}/maquinas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (response.ok) {
        setMaquinas(maquinas.filter((m) => m.id !== id))
        toast.success("Máquina removida com sucesso!")
      } else {
        const err = await response.json().catch(() => ({}))
        toast.error(err?.erro ?? "Erro ao excluir máquina")
      }
    } catch {
      toast.error("Erro de conexão ao excluir máquina")
    }
  }

  const ativa = Boolean(maquina.ativa)

  return (
    <tr className="group border-b border-sky-100/60 hover:bg-white/60 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800/70">
      {/* Foto */}
      <td className="px-6 py-4 align-middle">
        {maquina.lavanderia?.foto ? (
          <img
            src={maquina.lavanderia.foto}
            alt="Lavanderia"
            className="w-24 h-16 object-cover rounded-xl ring-1 ring-sky-100"
          />
        ) : (
          <div className="w-24 h-16 rounded-xl bg-sky-50 ring-1 ring-sky-100 grid place-content-center text-slate-400 text-xs">
            sem foto
          </div>
        )}
      </td>

      {/* Tipo */}
      <td className="px-6 py-4 align-middle">
        <span className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
          <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 shadow-sm" />
          {maquina.tipo}
        </span>
      </td>

      {/* Lavanderia */}
      <td className="px-6 py-4 align-middle">
        <span className="text-slate-700 dark:text-gray-100">{maquina.lavanderia?.nome}</span>
      </td>

      {/* Endereço */}
      <td className="px-6 py-4 align-middle">
        <span className="text-slate-600 dark:text-gray-300">{maquina.lavanderia?.endereco}</span>
      </td>

      {/* Status + Toggle */}
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${
              ativa
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-slate-100 text-slate-700 ring-slate-200"
            }`}
          >
            {ativa ? "Ativa" : "Inativa"}
          </span>

          <button
            onClick={() => toggleAtiva(maquina.id)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              ativa
                ? "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-300"
                : "bg-slate-400 hover:bg-slate-500 focus:ring-slate-300"
            }`}
            aria-label={ativa ? "Desativar máquina" : "Ativar máquina"}
            title={ativa ? "Desativar máquina" : "Ativar máquina"}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                ativa ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </td>

      {/* Ações */}
      <td className="px-6 py-4 align-middle">
        <button
          onClick={() => excluirMaquina(maquina.id)}
          className="text-red-600 hover:text-red-700 font-medium underline-offset-4 hover:underline"
        >
          Excluir
        </button>
      </td>
    </tr>
  )
}
