import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Toaster, toast } from "sonner"
import { useAdminStore } from "./context/AdminContext"
import { Link, useNavigate } from "react-router-dom"
import LavouLogo from "../assets/LavouLogo"
import { motion } from "framer-motion"
import { FiMail, FiLock } from "react-icons/fi"
import Footer from "./components/Footer"

const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "")

type Inputs = {
  email: string
  senha: string
}

type AdminResponse = {
  id: number
  nome: string
  email: string
  nivel: string
  token: string
}

export default function AdminLogin() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const navigate = useNavigate()
  const { logaAdmin } = useAdminStore()

  useEffect(() => {
    setFocus("email")
  }, [setFocus])

  async function verificaLogin(data: Inputs) {
    if (!apiUrl) {
      toast.error("Configuração inválida: VITE_API_URL não definida")
      console.error("VITE_API_URL ausente no .env")
      return
    }

    try {
      const res = await fetch(`${apiUrl}/admins/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(payload?.erro || "Login ou senha incorretos")
        return
      }

      const { id, nome, email, nivel, token } = (payload || {}) as Partial<AdminResponse>
      if (!token || !id || !email) {
        toast.error("Resposta inválida do servidor.")
        return
      }

      localStorage.setItem("adminToken", token)
      localStorage.setItem("adminPayload", JSON.stringify({ id, nome, email, nivel }))
      // @ts-expect-error — adequar ao tipo do seu store, se necessário
      logaAdmin({ id, nome: nome!, email: email!, nivel: nivel!, token })
      navigate("/admin", { replace: true })
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 dark:bg-gray-900">
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
        {/* Fundo suave com blobs azuis/esverdeados */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-sky-200 blur-3xl opacity-30" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-200 blur-3xl opacity-30" />
        </div>

        {/* Logo com fundo e borda azul claro #BAD3F9 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 w-fit rounded-2xl bg-[#BAD3F9] shadow-md ring-1 ring-[#BAD3F9] backdrop-blur p-[3px]"
        >
          <div className="rounded-xl bg-[#BAD3F9] px-5 py-3">
            <LavouLogo className="text-[#091F5B]" />
          </div>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md rounded-3xl bg-[#EAF4FF] border border-sky-400 
                     shadow-[0_20px_60px_rgba(2,132,199,0.1)] p-10 text-center"
        >
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
            🔑
          </div>

          <h1 className="text-2xl font-bold text-sky-600 mb-1">
            Acesso do Administrador
          </h1>

          <p className="text-slate-700 text-sm mb-6 font-medium">
            Bem-vindo ao painel administrativo do{" "}
            <span className="text-sky-700 font-semibold">Lavou</span> 🚀
            <br />Gerencie lavanderias, máquinas e reservas de forma rápida e segura.
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit(verificaLogin)} className="space-y-4 text-left">
            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-slate-800">
                E-mail
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  required
                  placeholder="admin@lavou.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block mb-1 text-sm font-medium text-slate-800">
                Senha
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  id="senha"
                  {...register("senha")}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white text-slate-800 border border-slate-300 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition"
                />
              </div>
            </div>

            {/* Botão com degradê e cursor de mão */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full mt-4 cursor-pointer bg-gradient-to-r from-sky-600 to-teal-600 
                         hover:from-sky-700 hover:to-teal-700 text-white font-semibold 
                         py-2.5 rounded-xl shadow-md transition-all duration-300 
                         focus:ring-4 focus:ring-sky-300"
            >
              Entrar
            </motion.button>

            {/* Link: voltar ao site principal */}
            <div className="pt-3 text-center">
              <Link
                to="/"
                className="text-sky-700 hover:text-sky-800 underline underline-offset-4 transition-colors"
              >
                Voltar ao site principal
              </Link>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Footer fixo no final */}
      <Footer />

      <Toaster richColors position="top-right" />
    </div>
  )
}
