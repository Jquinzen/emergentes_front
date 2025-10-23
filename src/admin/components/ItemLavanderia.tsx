import { toast } from "sonner"
import type { LavanderiaType } from "../../utils/LavanderiaType"
import { Trash2, MapPin, Star } from "lucide-react"

const apiUrl = import.meta.env.VITE_API_URL

type Props = {
  lav: LavanderiaType
  lavanderias: LavanderiaType[]
  setLavanderias: (list: LavanderiaType[]) => void
}

export default function ItemLavanderia({ lav, lavanderias, setLavanderias }: Props) {
  const token = localStorage.getItem("adminToken") ?? ""

  async function excluir() {
    if (!confirm(`Confirma exclusão da lavanderia "${lav.nome}"?`)) return
    try {
      const r = await fetch(`${apiUrl}/lavanderias/${lav.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (r.ok) {
        setLavanderias(lavanderias.filter((x) => x.id !== lav.id))
        toast.success("Lavanderia excluída")
      } else {
        const err = await r.json().catch(() => ({}))
        toast.error(err?.erro ?? "Erro ao excluir lavanderia")
      }
    } catch {
      toast.error("Erro de conexão")
    }
  }

  async function toggleDestaque() {
    try {
      // otimista: aplica localmente antes
      setLavanderias(lavanderias.map((x) => (x.id === lav.id ? { ...x, destaque: !x.destaque } : x)))

      const r = await fetch(`${apiUrl}/lavanderias/${lav.id}/destaque`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!r.ok) {
        // desfaz otimismo se deu ruim
        setLavanderias(lavanderias)
        const err = await r.json().catch(() => ({}))
        toast.error(err?.erro ?? "Erro ao alternar destaque")
        return
      }

      const atualizado: LavanderiaType = await r.json()
      setLavanderias((list) => list.map((x) => (x.id === lav.id ? { ...x, destaque: atualizado.destaque } : x)))
      toast.success(atualizado.destaque ? "Marcada como destaque" : "Removida do destaque")
    } catch {
      // desfaz otimismo em erro de rede
      setLavanderias(lavanderias)
      toast.error("Erro de conexão")
    }
  }

  const destaqueAtivo = !!lav.destaque

  return (
    <tr className="border-b last:border-b-0 hover:bg-sky-50/40 transition-colors">
      {/* Foto */}
      <td className="px-6 py-4">
        {lav.foto ? (
          <img src={lav.foto} alt={lav.nome} className="w-24 h-16 object-cover rounded-xl ring-1 ring-slate-200" />
        ) : (
          <span className="text-xs text-slate-400 italic">sem foto</span>
        )}
      </td>

      {/* Nome + endereço */}
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900">{lav.nome}</div>
        <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate max-w-[320px]">{lav.endereco}</span>
        </div>
      </td>

      {/* Máquinas */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center justify-center h-7 px-3 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200">
          {lav.qntMaquinas} {lav.qntMaquinas === 1 ? "máquina" : "máquinas"}
        </span>
      </td>

      {/* Destaque (toggle clicável) */}
      <td className="px-6 py-4">
        <button
          type="button"
          onClick={toggleDestaque}
          role="switch"
          aria-checked={destaqueAtivo}
          title={destaqueAtivo ? "Desmarcar como destaque" : "Marcar como destaque"}
          className={`inline-flex items-center gap-2 h-8 px-2 pr-2.5 rounded-full text-xs font-semibold ring-1 transition
            ${destaqueAtivo
              ? "bg-amber-50 text-amber-700 ring-amber-200"
              : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200"
            }`}
        >
          <span
            className={`inline-flex items-center justify-center h-6 w-6 rounded-full bg-white shadow transition-transform
              ${destaqueAtivo ? "translate-x-0" : "translate-x-0"}`}
          >
            <Star className={`h-3.5 w-3.5 ${destaqueAtivo ? "text-amber-500" : "text-slate-400"}`} />
          </span>
          <span className="min-w-[24px] text-left">{destaqueAtivo ? "Sim" : "Não"}</span>
        </button>
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <button
          onClick={excluir}
          title="Excluir lavanderia"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold
                     text-white bg-gradient-to-r from-rose-500 to-rose-600
                     hover:from-rose-600 hover:to-rose-700
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300
                     shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      </td>
    </tr>
  )
}