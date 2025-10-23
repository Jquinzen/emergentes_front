import { FiCheck, FiX, FiSlash, FiCheckCircle, FiEdit2 } from "react-icons/fi"
import type { ReservaType } from "../../utils/ReservaType"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

type ReservaComCliente = ReservaType & {
  cliente?: { id: number; nome: string; email?: string }
}

type Props = {
  reserva: ReservaComCliente
  reservas: ReservaComCliente[]
  setReservas: React.Dispatch<React.SetStateAction<ReservaComCliente[]>>
}

function dataHoraBR(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function StatusBadge({ status }: { status: ReservaComCliente["status"] }) {
  const map: Record<string, string> = {
    PENDENTE: "bg-amber-50 text-amber-700 ring-amber-200",
    CONFIRMADA: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    RECUSADA: "bg-rose-50 text-rose-700 ring-rose-200",
    CANCELADA: "bg-slate-100 text-slate-700 ring-slate-200",
  }
  const label = status.charAt(0) + status.slice(1).toLowerCase()
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${map[status]}`}>
      {label}
    </span>
  )
}

export default function ItemReserva({ reserva, reservas, setReservas }: Props) {
  const token = localStorage.getItem("adminToken") ?? ""

  async function patchReserva(status: "CONFIRMADA" | "RECUSADA" | "CANCELADA") {
    let resposta: string | undefined = undefined
    const msg = prompt(`Mensagem para o cliente (opcional):`, reserva.resposta ?? "")
    if (msg !== null && msg.trim() !== "") resposta = msg.trim()

    try {
      const response = await fetch(`${apiUrl}/reservas/${reserva.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, resposta }),
      })

      if (response.ok) {
        const atualizada: ReservaComCliente = await response.json()
        const lista = reservas.map((r) => (r.id === reserva.id ? atualizada : r))
        setReservas(lista)
        toast.success(`Reserva ${status.toLowerCase()}!`)
      } else {
        const err = await response.json().catch(() => ({}))
        toast.error(err?.erro ?? "Erro ao atualizar reserva")
      }
    } catch {
      toast.error("Erro de conexão")
    }
  }

  const nomeCliente = reserva.cliente?.nome ?? `Cliente #${reserva.clienteId}`

  // estilos base p/ botões “premium”
  const baseBtn =
    "inline-flex items-center justify-center h-9 px-4 rounded-2xl text-xs font-semibold transition-all " +
    "active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "ring-1 ring-inset shadow-sm hover:shadow-md"

  const confirmBtn =
    `${baseBtn} text-white bg-gradient-to-r from-emerald-500 to-emerald-600 ` +
    "hover:from-emerald-600 hover:to-emerald-700 ring-emerald-400/30 focus-visible:ring-emerald-300 " +
    "ring-offset-white/40"

  const rejectBtn =
    `${baseBtn} text-white bg-gradient-to-r from-rose-500 to-rose-600 ` +
    "hover:from-rose-600 hover:to-rose-700 ring-rose-400/30 focus-visible:ring-rose-300 " +
    "ring-offset-white/40"

  const cancelBtn =
    `${baseBtn} text-white bg-gradient-to-r from-slate-500 to-slate-600 ` +
    "hover:from-slate-600 hover:to-slate-700 ring-slate-400/30 focus-visible:ring-slate-300 " +
    "ring-offset-white/40"

  const ghostBtn =
    `${baseBtn} text-sky-700 bg-white/70 backdrop-blur ring-sky-200 hover:bg-white ` +
    "focus-visible:ring-sky-300"

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-6 py-4">
        {reserva.maquina.lavanderia?.foto ? (
          <img
            src={reserva.maquina.lavanderia.foto}
            alt="Lavanderia"
            className="w-28 h-20 object-cover rounded-xl ring-1 ring-sky-100"
          />
        ) : (
          <div className="w-28 h-20 rounded-xl bg-sky-50 ring-1 ring-sky-100 flex items-center justify-center text-xs text-slate-400">
            sem foto
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900">{reserva.maquina.lavanderia?.nome}</div>
        <div className="text-xs text-slate-500">{reserva.maquina.lavanderia?.endereco}</div>
        <div className="mt-1 text-slate-700">
          Máquina: <b>{reserva.maquina.tipo}</b> #{reserva.maquinaId}
        </div>
      </td>

      <td className="px-6 py-4 text-slate-800">{nomeCliente}</td>

      <td className="px-6 py-4">
        <div><b>Início:</b> {dataHoraBR(reserva.startsAt)}</div>
        <div><b>Fim:</b> {dataHoraBR(reserva.endsAt)}</div>
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={reserva.status} />
      </td>

      <td className="px-6 py-4 max-w-xs">
        <div className="line-clamp-2 text-slate-700">
          {reserva.resposta ?? <i className="text-slate-400">—</i>}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap items-center gap-2">

          {reserva.status === "PENDENTE" ? (
            <>
              <button
                onClick={() => patchReserva("CONFIRMADA")}
                className={confirmBtn}
                title="Confirmar"
              >
                <FiCheck className="h-4 w-4 -ml-0.5 mr-1" />
                Confirmar
              </button>

              <button
                onClick={() => patchReserva("RECUSADA")}
                className={rejectBtn}
                title="Recusar"
              >
                <FiX className="h-4 w-4 -ml-0.5 mr-1" />
                Recusar
              </button>
            </>
          ) : reserva.status === "CONFIRMADA" ? (
            <button
              onClick={() => patchReserva("CANCELADA")}
              className={cancelBtn}
              title="Cancelar"
            >
              <FiSlash className="h-4 w-4 -ml-0.5 mr-1" />
              Cancelar
            </button>
          ) : (
            <span className="inline-flex items-center h-9 px-4 rounded-2xl text-xs font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100">
              <FiCheckCircle className="h-4 w-4 -ml-0.5 mr-1" />
              Finalizada
            </span>
          )}

          <button
            type="button"
            className={ghostBtn}
            title="Editar mensagem ao cliente"
            onClick={() => patchReserva(reserva.status as any)}
          >
            <FiEdit2 className="h-4 w-4 -ml-0.5 mr-1" />
            Mensagem
          </button>
        </div>
      </td>
    </tr>
  )
}
