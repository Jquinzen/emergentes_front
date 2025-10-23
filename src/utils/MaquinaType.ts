import type { LavanderiaType } from "./LavanderiaType"

export type MaquinaType = {
  id: number
  tipo: "LAVAR" | "SECAR"
  ativa: boolean
  createdAt: string | null
  foto: string | null
  updatedAt: string
  lavanderiaId: number
  lavanderia?: LavanderiaType
}
