import "./Detalhes.css"
import type { MaquinaType } from "./utils/MaquinaType"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Footer from "./components/Footer"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const apiUrl = import.meta.env.VITE_API_URL

export default function Detalhes() {
  const params = useParams()
  const maquinaId = Number(params.maquinaId ?? params.carroId ?? params.id)
  const [maquina, setMaquina] = useState<MaquinaType>()
  const { cliente } = useClienteStore()
  const { handleSubmit, reset } = useForm()
  const [startDate, setStartDate] = useState<Date | null>(null)

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/maquinas/${maquinaId}`)
      const dados = await response.json()
      setMaquina(dados)
    }
    if (maquinaId) buscaDados()
  }, [maquinaId])

  async function criaReserva() {
    if (!cliente?.id) {
      toast.error("Você precisa estar logado como cliente para reservar.")
      return
    }
    if (!startDate) {
      toast.error("Informe data e hora de início.")
      return
    }

    const body = {
      clienteId: cliente.id,
      maquinaId: Number(maquinaId),
      startsAt: startDate.toISOString(),
    }

    const response = await fetch(`${apiUrl}/reservas`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body),
    })

    if (response.status === 201) {
      toast.success("Reserva criada! Aguarde confirmação do admin.")
      reset()
      setStartDate(null)
    } else {
      const erro = await response.json().catch(() => ({}))
      toast.error(erro?.erro ?? "Não foi possível criar a reserva (verifique o horário).")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 dark:bg-gray-900 text-slate-800 dark:text-gray-100">
      <main className="flex-grow flex justify-center items-start px-4 mt-32">
        {/* Card com altura fixa em desktop para impedir quebra */}
        <section
          className="
           flex flex-col md:flex-row
        bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden
          max-w-5xl w-full hover:shadow-xl transition-all duration-300
          md:h-[460px]  /* <- controla a altura total no desktop */
          "
        >
          {/* LADO DA IMAGEM: metade do card, altura 100% no desktop */}
          {maquina?.lavanderia?.foto && (
            <div className="w-full md:w-1/2 h-64 md:h-full shrink-0 overflow-hidden">
              <img
                src={maquina.lavanderia.foto as string}
                alt="Foto da Lavanderia"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* CONTEÚDO: ocupa a outra metade; scrolla internamente se passar */}
          <div className="flex flex-col justify-start gap-2 p-6 w-full md:w-1/2 min-w-0 md:h-full overflow-y-auto">
            <h5 className="text-2xl font-bold tracking-tight text-sky-700 dark:text-white">
              {maquina?.tipo === "LAVAR" ? "Máquina de Lavar" : "Máquina de Secar"} #{maquina?.id}
            </h5>

            <p className="text-lg font-semibold text-slate-700 dark:text-white">
              Lavanderia: {maquina?.lavanderia?.nome}
            </p>

            <p className="text-sm text-slate-600 dark:text-gray-300">
              Endereço: {maquina?.lavanderia?.endereco}
            </p>

            <p className="text-sm font-medium dark:text-gray-300">
              Status:{" "}
              <span className={maquina?.ativa ? "text-emerald-600" : "text-red-500"}>
                {maquina?.ativa ? "Ativa" : "Inativa"}
              </span>
            </p>

            {cliente?.id ? (
              <>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mt-2">
                  🗓️ Reserve esta máquina por 1 hora
                </h3>

                <form onSubmit={handleSubmit(criaReserva)} className="space-y-3">
                  <input
                    type="text"
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
                    value={`${cliente.nome} (${cliente.email})`}
                    disabled
                    readOnly
                  />

                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Data e Hora de Início
                  </label>

                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeIntervals={30}
                    placeholderText="Selecione a data e hora"
                    className="w-full p-2.5 border border-slate-300 rounded-lg
                               focus:ring-2 focus:ring-sky-400 focus:border-sky-500
                               shadow-sm hover:shadow-md transition-all bg-white text-slate-700"
                  />

                  <button
                    type="submit"
                    className="w-full text-white bg-sky-600 hover:bg-cyan-500
                               focus:ring-4 focus:ring-sky-300 font-medium
                               rounded-lg text-sm px-6 py-2.5 transition-colors duration-300"
                  >
                    Reservar
                  </button>
                </form>
              </>
            ) : (
              <h2 className="text-lg text-slate-700 font-medium mt-2 dark:text-white">
                Faça login como cliente para reservar!
              </h2>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
