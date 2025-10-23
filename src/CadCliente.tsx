import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { FiUser, FiMail, FiLock } from "react-icons/fi"
import Footer from "./components/Footer"

type Inputs = {
  nome: string
  email: string
  senha: string
  senha2: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function CadCliente() {
  const { register, handleSubmit } = useForm<Inputs>()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  async function cadastraCliente(data: Inputs) {
    if (data.senha !== data.senha2) {
      toast.error("Erro... Senha e Confirme Senha precisam ser iguais")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/clientes`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
        }),
      })

      if (response.status === 201) {
        toast.success("Ok! Cadastro realizado com sucesso!")
      } else {
        const err = await response.json().catch(() => ({}))
        toast.error(err?.erro ?? "Erro... Não foi possível realizar o cadastro")
      }
    } catch {
      toast.error("Erro de conexão com o servidor. Tente novamente.")
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-sky-50/70 dark:bg-gray-900 overflow-hidden">
      {/* Bolhas de fundo suaves */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-sky-300 blur-3xl opacity-30" />
        <div className="absolute -bottom-16 -right-20 h-96 w-96 rounded-full bg-teal-300 blur-3xl opacity-30" />
      </div>

      <main className="flex-grow flex items-start justify-center px-6 mt-44 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -2 }}
          className="relative w-full max-w-md p-[1px] rounded-3xl 
                     bg-[#BAD3F9]
                     shadow-[0_20px_60px_rgba(2,132,199,0.15)]"
        >
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 dark:bg-gray-800/80 dark:border-gray-700">
            <div className="px-8 pt-8 pb-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-sky-600 dark:text-white">
                Cadastro de Cliente
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Crie sua conta para começar a reservar máquinas
              </p>
            </div>

            <form onSubmit={handleSubmit(cadastraCliente)} className="px-8 pb-8 space-y-5">
              {/* Nome */}
              <div className="space-y-2">
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-slate-700 dark:text-gray-200"
                >
                  Nome completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <FiUser />
                  </span>
                  <input
                    id="nome"
                    type="text"
                    required
                    {...register("nome")}
                    placeholder="Ex: Ana Souza"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 text-slate-800
                               border border-slate-300 shadow-sm
                               focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500
                               transition-all placeholder:text-slate-400
                               dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Email */}
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
                    placeholder="usuario@exemplo.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 text-slate-800
                               border border-slate-300 shadow-sm
                               focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500
                               transition-all placeholder:text-slate-400
                               dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label
                  htmlFor="senha"
                  className="block text-sm font-medium text-slate-700 dark:text-gray-200"
                >
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <FiLock />
                  </span>
                  <input
                    id="senha"
                    type="password"
                    required
                    {...register("senha")}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 text-slate-800
                               border border-slate-300 shadow-sm
                               focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500
                               transition-all placeholder:text-slate-400
                               dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <label
                  htmlFor="senha2"
                  className="block text-sm font-medium text-slate-700 dark:text-gray-200"
                >
                  Confirme sua senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <FiLock />
                  </span>
                  <input
                    id="senha2"
                    type="password"
                    required
                    {...register("senha2")}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/90 text-slate-800
                               border border-slate-300 shadow-sm
                               focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500
                               transition-all placeholder:text-slate-400
                               dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Botão */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group w-full relative overflow-hidden rounded-xl
                           text-white font-medium text-sm py-2.5 shadow-sm
                           focus:outline-none focus:ring-4 focus:ring-sky-300"
              >
                <span
                  className="absolute inset-0 bg-[length:200%_200%]
                             bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500
                             group-hover:animate-[bg-pan_3s_linear_infinite]"
                />
                <span className="relative">Criar Conta</span>
              </motion.button>

              <p className="text-sm text-center text-slate-600 dark:text-gray-400">
                Já possui uma conta?{" "}
                <Link
                  to="/login"
                  className="text-sky-600 hover:text-sky-800 font-semibold underline-offset-4 hover:underline"
                >
                  Faça Login
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />

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
