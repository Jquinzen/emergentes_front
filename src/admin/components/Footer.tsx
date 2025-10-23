import { Link } from "react-router-dom"
import { FiInstagram, FiFacebook, FiMail } from "react-icons/fi"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-600 to-teal-600 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Logo / Sobre */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Lavou</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Sistema de reservas para lavanderias — rápido, prático e sem filas.
            Encontre a máquina disponível mais próxima e agende em segundos.
          </p>
        </div>

        {/* Links de navegação */}
        <div className="flex flex-col sm:items-center">
          <h3 className="text-lg font-semibold mb-3">Navegação</h3>
          <ul className="space-y-2 text-white/90 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link to="/minhas-reservas" className="hover:text-white transition-colors">
                Minhas Reservas
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Login / Cadastro
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato / redes sociais */}
        <div className="sm:text-right">
          <h3 className="text-lg font-semibold mb-3">Contato</h3>
          <ul className="space-y-2 text-white/90 text-sm">
            <li className="flex items-center justify-start sm:justify-end gap-2">
              <FiMail /> <span>contato@lavou.com.br</span>
            </li>
            <li className="flex items-center justify-start sm:justify-end gap-2">
              <FiInstagram /> <span>@lavouapp</span>
            </li>
            <li className="flex items-center justify-start sm:justify-end gap-2">
              <FiFacebook /> <span>/lavou</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <p className="text-center text-white/70 text-sm py-4">
          © {new Date().getFullYear()} Lavou — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
