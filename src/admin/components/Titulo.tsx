import { FiUsers } from "react-icons/fi"
import { Link } from "react-router-dom"
import { useAdminStore } from "../context/AdminContext"
import LavouLogo from "../../assets/LavouLogo"

export function Titulo() {
  const { admin } = useAdminStore()

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-sky-600 to-teal-600 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo com efeito de brilho */}
        <Link
          to="/admin"
          className="relative flex items-center space-x-3 transition-transform hover:scale-105"
        >
          {/* Efeito de brilho dinâmico */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-white/30 via-white/10 to-transparent blur-md opacity-0 group-hover:opacity-80 transition duration-500"></div>

          {/* Camada de luz fixa para brilho contínuo */}
          <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm animate-pulse"></div>

          <div className="relative z-10">
            <LavouLogo width={120} height={42} />
          </div>
        </Link>

        {/* Informações do admin */}
        <div className="flex items-center gap-3 text-white font-medium">
          <FiUsers className="text-xl" />
          <span className="hidden sm:inline">{admin?.nome ?? "Administrador"}</span>

          <Link
            to="/admin/lavanderias"
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm backdrop-blur-md transition"
          >
            Gerenciar
          </Link>
        </div>
      </div>

      {/* Linha inferior de brilho */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"></div>
    </nav>
  )
}
