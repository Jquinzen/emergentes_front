
import { create } from "zustand"

export type AdminType = {
  id: string
  nome: string
  email: string
  nivel: number
  token: string          
}

type AdminStore = {
  admin: AdminType
  logaAdmin: (adminLogado: AdminType, persistir?: boolean) => void
  deslogaAdmin: () => void
}

// tenta restaurar do localStorage na inicialização
function getInitialAdmin(): AdminType {
  try {
    const raw = localStorage.getItem("adminPayload")
    if (!raw) return {} as AdminType
    const parsed = JSON.parse(raw)
    return parsed as AdminType
  } catch {
    return {} as AdminType
  }
}

export const useAdminStore = create<AdminStore>((set) => ({
  admin: getInitialAdmin(),

  // agora aceita token e pode persistir
  logaAdmin: (adminLogado, persistir = true) => {
    if (persistir) {
      localStorage.setItem("adminPayload", JSON.stringify(adminLogado))
      localStorage.setItem("adminToken", adminLogado.token ?? "")
    }
    set({ admin: adminLogado })
  },

  deslogaAdmin: () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminPayload")
    set({ admin: {} as AdminType })
  },
}))
