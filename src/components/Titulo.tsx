import { FiUser } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import { useClienteStore } from "../context/ClienteContext"
import LavouLogo from "../assets/LavouLogo"

export default function Titulo() {
  const { cliente, deslogaCliente } = useClienteStore()
  const navigate = useNavigate()

  function clienteSair() {
    if (confirm("Confirma saída do sistema?")) {
      deslogaCliente()
      localStorage.removeItem("clienteKey")
      navigate("/login")
    }
  }

return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-sky-600 to-teal-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center space-x-3">
          <LavouLogo width={120} height={42} />
        </Link>

        <div className="flex items-center gap-4 text-white font-medium">
          <FiUser className="text-xl" />

          {cliente?.id ? (
            <>
              <span className="hidden sm:inline">{cliente.nome}</span>

              <Link
                to="/minhas-reservas"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm backdrop-blur-md transition"
              >
                Minhas Reservas
              </Link>

              <button
              onClick={clienteSair}
              className="hover:underline hover:text-gray-100 transition cursor-pointer"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:underline hover:text-gray-100 transition"
            >
              Login / Cadastro
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}