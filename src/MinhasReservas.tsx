import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useClienteStore } from "./context/ClienteContext"
import type { ReservaType } from "./utils/ReservaType"
import Footer from "./components/Footer"
import { motion } from "framer-motion" // ⬅️ animação

const apiUrl = import.meta.env.VITE_API_URL

export default function MinhasReservas() {
  const [reservas, setReservas] = useState<ReservaType[]>([])
  const { cliente } = useClienteStore()

  useEffect(() => {
    async function buscaDados() {
      if (!cliente?.id) return
      const response = await fetch(`${apiUrl}/reservas/cliente/${cliente.id}`)
      const dados = await response.json()
      setReservas(dados)
    }
    buscaDados()
  }, [cliente])

  function dataHoraBR(dataISO: string) {
    const data = new Date(dataISO)
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const temReservas = useMemo(() => reservas.length > 0, [reservas])

  // ---------------------------
  // ESTADO: usuário NÃO logado
  // ---------------------------
  if (!cliente?.id) {
    return (
      <div className="min-h-screen flex flex-col bg-sky-50 dark:bg-gray-900">
        <main className="flex-grow pt-28 px-4 pb-12 max-w-5xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-sky-600 dark:text-white">
              Minhas Reservas
            </h1>
            <p className="mt-2 text-slate-600 dark:text-gray-300">
              Entre na sua conta para visualizar e gerenciar seus agendamentos.
            </p>
          </header>

          <div className="relative mx-auto max-w-3xl">
            <div className="pointer-events-none absolute -top-8 -left-8 h-40 w-40 rounded-full bg-sky-200 blur-3xl opacity-40" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-teal-200 blur-3xl opacity-40" />

            {/* animação no card (não logado) */}
            <motion.div
              className="relative rounded-3xl p-[1px] bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 shadow-[0_20px_60px_rgba(2,132,199,0.15)]"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 dark:bg-gray-800/90 dark:border-gray-700">
                <div className="px-8 py-10 md:px-12 md:py-12 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                    <span className="text-2xl">🔐</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                    Você não está conectado
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-gray-300 max-w-xl mx-auto">
                    Faça login para acompanhar suas reservas, confirmar horários e ver o histórico.
                    Se ainda não tem conta, crie a sua em poucos segundos.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to="/login"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl
                                 bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors
                                 focus:outline-none focus:ring-4 focus:ring-sky-300"
                    >
                      Entrar
                    </Link>

                    <Link
                      to="/cadCliente"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl
                                 border border-sky-200 text-sky-700 hover:bg-sky-50 font-medium
                                 transition-colors focus:outline-none focus:ring-4 focus:ring-sky-200
                                 dark:border-gray-600 dark:text-sky-300 dark:hover:bg-gray-700/50"
                    >
                      Criar conta
                    </Link>

                    <Link
                      to="/"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl
                                 text-sky-700 hover:text-sky-800 font-medium underline underline-offset-4
                                 focus:outline-none"
                    >
                      Explorar máquinas →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // ------------------------
  // ESTADO: usuário logado
  // ------------------------
  return (
    <div className="min-h-screen flex flex-col bg-sky-50 dark:bg-gray-900 text-slate-800 dark:text-gray-100">
      <main className="flex-grow pt-28 px-4 pb-10 max-w-7xl mx-auto">
        <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-sky-600">
          Minhas{" "}
          <span className="">
            Reservas
          </span>
        </h1>

       {!temReservas ? (
  <div className="mt-16 flex flex-col items-center justify-center text-center">
    <div className="relative">
      <div className="absolute -inset-6 bg-sky-200 blur-3xl opacity-30 rounded-full"></div>
      <div className="relative bg-[#BAD3F9] rounded-3xl shadow-lg p-10 border border-sky-400 max-w-xl mx-auto">
        <div className="text-5xl mb-4 animate-bounce">🧺</div>
        <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-3">
          Nenhuma reserva encontrada
        </h2>
        <p className="text-slate-700 text-base md:text-lg leading-relaxed">
          Parece que você ainda não possui nenhuma reserva ativa.  
          Que tal agendar sua primeira lavagem e deixar tudo limpinho? ✨
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-gradient-to-r from-sky-600 to-teal-600 
                     hover:from-sky-700 hover:to-teal-700 text-white font-semibold 
                     px-6 py-2.5 rounded-xl shadow-md transition-transform duration-300 
                     hover:scale-105 cursor-pointer"
        >
          Fazer minha primeira reserva
        </a>
      </div>
    </div>
  </div>
) : (

          // ⬇️ animação aplicada no "card" da tabela (logado)
          <motion.div
            className="overflow-x-auto rounded-2xl border border-slate-200 shadow bg-white"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs uppercase bg-sky-100 text-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Máquina</th>
                  <th scope="col" className="px-6 py-3">Foto</th>
                  <th scope="col" className="px-6 py-3">Período</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr
                    key={reserva.id}
                    className="bg-white border-b border-slate-200 hover:bg-sky-50/60 transition-colors"
                  >
                    <th scope="row" className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap align-top">
                      <p className="text-sky-700 font-semibold">
                        {reserva.maquina.tipo === "LAVAR" ? "Máquina de Lavar" : "Máquina de Secar"}
                      </p>
                      <p className="mt-2 text-slate-700">
                        <span className="text-slate-500">Lavanderia:</span>{" "}
                        {reserva.maquina.lavanderia?.nome}
                      </p>
                      <p className="text-sm text-slate-500">
                        {reserva.maquina.lavanderia?.endereco}
                      </p>
                    </th>

                    <td className="px-6 py-4 align-top">
                      <div className="w-36 h-24 md:w-40 md:h-28 rounded-lg overflow-hidden bg-slate-100 shadow-sm">
                        {reserva.maquina.lavanderia?.foto ? (
                          <img
                            src={reserva.maquina.lavanderia.foto}
                            alt="Lavanderia"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            sem foto
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <p className="text-slate-700">
                        <b className="text-slate-600">Início:</b> {dataHoraBR(reserva.startsAt)}
                      </p>
                      <p className="text-slate-700">
                        <b className="text-slate-600">Fim:</b> {dataHoraBR(reserva.endsAt)}
                      </p>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <p
                        className={`font-semibold ${
                          reserva.status === "CONFIRMADA"
                            ? "text-emerald-600"
                            : reserva.status === "CANCELADA"
                            ? "text-red-500"
                            : "text-sky-700"
                        }`}
                      >
                        {reserva.status}
                      </p>
                      {reserva.resposta && (
                        <p className="text-sky-700 italic">{reserva.resposta}</p>
                      )}
                      {reserva.respondidaEm && (
                        <p className="text-xs text-slate-500 italic">
                          Atualizado: {dataHoraBR(reserva.respondidaEm)}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}
