import { useAdminStore } from "../context/AdminContext"
import type { AdminType } from "../../utils/AdminType"
import { Trash2, Shield, UserCircle2, Mail } from "lucide-react"

import type { Dispatch, SetStateAction } from "react"

type Props = {
  adminLinha: AdminType
  setAdmins: Dispatch<SetStateAction<AdminType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemAdmin({ adminLinha, setAdmins }: Props) {

  const { admin } = useAdminStore()

  async function excluirAdmin() {
    if (!admin || admin.nivel <= 1) {
      alert("Você não tem permissão para excluir admins")
      return
    }
    if (!confirm(`Confirma a exclusão do admin "${adminLinha.nome}"?`)) return

    try {
      const response = await fetch(`${apiUrl}/admins/${adminLinha.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      })

      if (response.status === 204) {
        setAdmins((list) => list.filter((x) => x.id !== adminLinha.id))
        alert("Admin excluído com sucesso")
      } else {
        const err = await response.json().catch(() => ({}))
        alert(err?.erro ?? "Erro... Admin não foi excluído")
      }
    } catch {
      alert("Erro de conexão ao excluir admin")
    }
  }

  async function alterarNivel() {
    if (!admin) {
      alert("Você não tem permissão para alterar nível")
      return
    }
    const nivel = Number(prompt("Novo Nível do Admin? (1 a 5)", String(adminLinha.nivel)))
    if (isNaN(nivel) || nivel < 1 || nivel > 5) {
      alert("Erro... Nível deve ser entre 1 e 5")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/admins/${adminLinha.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify({ nivel }),
      })

      if (response.ok) {
        setAdmins((list) => list.map((x) => (x.id === adminLinha.id ? { ...x, nivel } : x)))
      } else {
        const err = await response.json().catch(() => ({}))
        alert(err?.erro ?? "Erro ao alterar nível")
      }
    } catch {
      alert("Erro de conexão ao alterar nível")
    }
  }

  const nivelChip =
    adminLinha.nivel >= 4
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : adminLinha.nivel === 3
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : adminLinha.nivel === 2
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-slate-100 text-slate-700 ring-slate-200"

  return (
    <tr className="border-b last:border-b-0 hover:bg-sky-50/40 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-sky-100 text-sky-700 ring-1 ring-sky-200 flex items-center justify-center">
            <UserCircle2 className="h-5 w-5" />
          </div>
          <div className="font-semibold text-slate-900">{adminLinha.nome}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-2 text-slate-700">
          <Mail className="h-4 w-4 text-slate-400" />
          <span className="truncate">{adminLinha.email}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${nivelChip}`}>
          Nível {adminLinha.nivel}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={alterarNivel}
            title="Alterar Nível"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold
                       text-sky-700 bg-white/70 backdrop-blur ring-1 ring-sky-200
                       hover:bg-white hover:text-sky-900 shadow-sm hover:shadow-md transition"
          >
            <Shield className="h-4 w-4" />
            Alterar Nível
          </button>

          <button
            type="button"
            onClick={excluirAdmin}
            title="Excluir"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold
                       text-white bg-gradient-to-r from-rose-500 to-rose-600
                       hover:from-rose-600 hover:to-rose-700
                       ring-1 ring-rose-400/30 shadow-sm hover:shadow-md transition"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      </td>
    </tr>
  )
}
