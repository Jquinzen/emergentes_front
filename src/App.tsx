import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"

import { CardMaquina } from "./components/CardMaquina"
import type { MaquinaType } from "./utils/MaquinaType"
import { InputPesquisa } from "./components/InputPesquisa"
import Footer from "./components/Footer"

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [maquinas, setMaquinas] = useState<MaquinaType[]>([])
  const { logaCliente } = useClienteStore()

  useEffect(() => {
    async function buscaMaquinas() {
      const response = await fetch(`${apiUrl}/maquinas`)
      const dados = await response.json()
      setMaquinas(dados)
    }
    buscaMaquinas()

    async function buscaCliente(id: string) {
      const response = await fetch(`${apiUrl}/clientes/${id}`)
      const dados = await response.json()
      logaCliente(dados)
    }
    const idCliente = localStorage.getItem("clienteKey")
    if (idCliente) {
      buscaCliente(idCliente)
    }
  }, [logaCliente])

  return (
    <div className="min-h-screen flex flex-col bg-sky-50 dark:bg-gray-900">
      {/* top spacing due to fixed navbar */}
      <main className="flex-grow pt-28 max-w-7xl mx-auto px-4">
        <InputPesquisa setMaquinas={setMaquinas} />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {maquinas.map((maq) => (
            <CardMaquina data={maq} key={maq.id} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
