import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"
import Footer from "./components/Footer"

import { motion } from "framer-motion"
import { FiMail, FiLock } from "react-icons/fi"

type Inputs = {
  email: string
  senha: string
  manter: boolean
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>()
  const { logaCliente } = useClienteStore()
  const navigate = useNavigate()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  async function verificaLogin(data: Inputs) {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      })

      if (response.status === 200) {
        const dados = await response.json()
        logaCliente(dados)
        if (data.manter) localStorage.setItem("clienteKey", dados.id)
        else localStorage.removeItem("clienteKey")
        navigate("/")
      } else {
        const err = await response.json().catch(() => ({}))
        toast.error(
          typeof err?.erro === "string" ? err.erro : "Erro... Login ou senha incorretos"
        )
      }
    } catch {
      toast.error("Falha de conexão com o servidor.")
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-sky-50/70 dark:bg-gray-900 overflow-hidden">
      {/* Fundo com blobs suaves */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-sky-300 blur-3xl opacity-30" />
        <div className="absolute -bottom-16 -right-20 h-96 w-96 rounded-full bg-teal-300 blur-3xl opacity-30" />
      </div>

      {/* Espaçamento para descolar bem da navbar */}
      <main className="flex-grow flex items-start justify-center px-6 mt-44 mb-12">
        {/* Moldura de degradê animado (border) */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2 }}
          className="relative w-full max-w-md p-[1px] rounded-3xl 
                     bg-[#BAD3F9]
                     shadow-[0_20px_60px_rgba(2,132,199,0.15)]"
        >
          {/* Card “glass” */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 dark:bg-gray-800/80 dark:border-gray-700">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-sky-600 dark:text-white">
                Acesse sua conta
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Faça login para gerenciar suas reservas
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(verificaLogin)} className="px-8 pb-8 space-y-5">
              {/* E-mail */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-gray-200"
                >
                  E-mail
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <FiMail />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    {...register("email")}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 text-slate-800
                               border border-slate-300 shadow-sm
                               focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500
                               transition-all placeholder:text-slate-400
                               dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-600"
                    placeholder="usuario@exemplo.com"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-gray-200"
                >
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <FiLock />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    {...register("senha")}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 text-slate-800
                               border border-slate-300 shadow-sm
                               focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500
                               transition-all placeholder:text-slate-400
                               dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Lembrar + Esqueci */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                  <input
                    id="remember"
                    type="checkbox"
                    {...register("manter")}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Manter conectado
                </label>
                <a
                  href="#"
                  className="text-sky-700 hover:text-sky-800 font-medium transition-colors"
                >
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group w-full relative overflow-hidden rounded-xl
                           text-white font-medium text-sm py-2.5 shadow-sm
                           focus:outline-none focus:ring-4 focus:ring-sky-300"
              >
                {/* gradiente animado */}
                <span
                  className="absolute inset-0 bg-[length:200%_200%]
                             bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500
                             group-hover:animate-[bg-pan_3s_linear_infinite]"
                />
                <span className="relative">Entrar</span>
              </motion.button>

              {/* CTA cadastro */}
              <p className="text-sm text-center text-slate-600 dark:text-gray-400">
                Ainda não possui conta?{" "}
                <Link
                  to="/cadCliente"
                  className="text-sky-600 hover:text-sky-800 font-semibold underline-offset-4 hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* animação do gradiente do botão */}
      <style>{`
        @keyframes bg-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
