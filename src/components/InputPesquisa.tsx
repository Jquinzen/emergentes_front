import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { MaquinaType } from "../utils/MaquinaType"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  termo: string
}

type InputPesquisaProps = {
  setMaquinas: React.Dispatch<React.SetStateAction<MaquinaType[]>>
}

export function InputPesquisa({ setMaquinas }: InputPesquisaProps) {
  const { register, handleSubmit, reset } = useForm<Inputs>()

  async function enviaPesquisa(data: Inputs) {
    if (data.termo.trim().length < 2) {
      toast.error("Informe, no mínimo, 2 caracteres")
      return
    }

    const response = await fetch(`${apiUrl}/maquinas/pesquisa/${data.termo}`)
    const dados = await response.json()
    setMaquinas(dados)
  }

  async function mostraAtivas() {
    const response = await fetch(`${apiUrl}/maquinas`)
    const dados = await response.json()
    reset({ termo: "" })
    setMaquinas(dados)
  }

//   

 return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <form className="flex w-full sm:flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
          <div className="relative w-full">
            <input
              type="search"
              id="default-search"
              placeholder="Pesquise por LAVAR/SECAR ou pelo nome da lavanderia..."
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 pl-10 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-450 dark:placeholder-gray-400"
              {...register("termo")}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-sky-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="ml-0 sm:ml-2 mt-2 sm:mt-0 bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-2 rounded-xl transition"
          >
            Pesquisar
          </button>
        </form>

        {/* <button
          type="button"
          onClick={mostraAtivas}
          className="w-full sm:w-auto bg-white hover:bg-purple-700 text-black font-medium px-5 py-2 rounded-xl transition"
        >
          Exibir Ativas
        </button>  */}

        {/* <button
        type="button"
        onClick={mostraAtivas}
        className="w-full sm:w-auto bg-white hover:bg-[var(--brand-lighter)] 
             text-[#091F5B] font-medium px-5 py-2 
             rounded-xl border-2 border-[#091F5B] 
             hover:border-blue-500 
             transition cursor-pointer"
        >
          Exibir Ativas
        </button> */}

        <button
          type="button"
          onClick={mostraAtivas}
          className="group w-full sm:w-auto bg-white border-2 border-s-stone-500 
                    text-[var(--brand-dark)] font-medium px-5 py-2 rounded-xl 
                    transition-all duration-300 cursor-pointer
                    hover:bg-sky-600 hover:border-transparent"
        >
          <span className="transition-colors duration-300 group-hover:text-white">
            Exibir Ativas
          </span>
        </button>
      </div>
    </div>
  )
}