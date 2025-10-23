import type { MaquinaType } from "./MaquinaType"

export type ReservaType = {
  id: number
  clienteId: string
  maquinaId: number
  startsAt: string
  endsAt: string
  status: "PENDENTE" | "CONFIRMADA" | "RECUSADA" | "CANCELADA"
  resposta?: string | null
  respondidaEm?: string | null
  maquina: MaquinaType
  createdAt: string
  updatedAt: string
}
