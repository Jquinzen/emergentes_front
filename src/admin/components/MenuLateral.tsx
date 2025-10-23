import { useAdminStore } from "../context/AdminContext"
import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck2,
  UserCog,
  Store,
  LogOut,
} from "lucide-react"

export function MenuLateral() {
  const navigate = useNavigate()
  const { admin, deslogaAdmin } = useAdminStore()

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      deslogaAdmin()
      navigate("/admin/login", { replace: true }) // ✅ redireciona para tela de login do admin
    }
  }

  const baseItem =
    "group flex items-center gap-3 px-3 py-2 rounded-xl transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
  const activeItem = "bg-white/15 text-white shadow-sm"
  const hoverItem = "hover:bg-white/10 hover:text-white"
  const iconBase =
    "h-5 w-5 shrink-0 stroke-[1.6] opacity-90 group-hover:opacity-100 transition-opacity"

  return (
    <aside
      id="default-sidebar"
      className="
        fixed mt-24 left-0 z-40 w-64 h-screen -translate-x-full sm:translate-x-0
        shadow-[inset_-3px_0_6px_rgba(0,0,0,0.25)]
      "
      aria-label="Sidebar"
    >
      {/* fundo gradiente harmônico com a navbar */}
      <div className="h-full overflow-y-auto bg-gradient-to-b from-sky-600 to-teal-600 text-white/90">
        {/* header do usuário */}
        <div className="px-4 pt-4 pb-3">
          <p className="text-[11px] uppercase tracking-wide text-white/70">
            Administrador
          </p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-semibold truncate">
              {admin?.nome ?? "Admin"}
            </span>
            {typeof admin?.nivel !== "undefined" && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15">
                Nível {admin.nivel}
              </span>
            )}
          </div>
        </div>

        <nav className="px-3 py-4">
          <ul className="space-y-1 font-medium">
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${baseItem} ${hoverItem} ${
                    isActive ? activeItem : "text-white/90"
                  }`
                }
              >
                <LayoutDashboard className={iconBase} />
                <span className="truncate">Visão Geral</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/maquinas"
                className={({ isActive }) =>
                  `${baseItem} ${hoverItem} ${
                    isActive ? activeItem : "text-white/90"
                  }`
                }
              >
                <Wrench className={iconBase} />
                <span className="truncate">Cadastro de Máquinas</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/reservas"
                className={({ isActive }) =>
                  `${baseItem} ${hoverItem} ${
                    isActive ? activeItem : "text-white/90"
                  }`
                }
              >
                <CalendarCheck2 className={iconBase} />
                <span className="truncate">Controle de Reservas</span>
              </NavLink>
            </li>

            {admin?.nivel === 3 && (
              <li>
                <NavLink
                  to="/admin/cadAdmin"
                  className={({ isActive }) =>
                    `${baseItem} ${hoverItem} ${
                      isActive ? activeItem : "text-white/90"
                    }`
                  }
                >
                  <UserCog className={iconBase} />
                  <span className="truncate">Cadastro de Admins</span>
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/admin/lavanderias"
                className={({ isActive }) =>
                  `${baseItem} ${hoverItem} ${
                    isActive ? activeItem : "text-white/90"
                  }`
                }
              >
                <Store className={iconBase} />
                <span className="truncate">Lavanderias</span>
              </NavLink>
            </li>
          </ul>

          <div className="my-4 h-px bg-white/10" />

          {/* Botão de saída */}
          <button onClick={adminSair} className="w-full text-left" type="button">
            <span
              className={`${baseItem} text-red-100 hover:bg-red-500/10 hover:text-white`}
            >
              <LogOut className={iconBase} />
              <span className="truncate">Sair do Sistema</span>
            </span>
          </button>
        </nav>
      </div>
    </aside>
  )
}
