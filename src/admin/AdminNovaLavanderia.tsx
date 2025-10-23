import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useEffect } from "react"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  nome: string
  foto?: string
  endereco: string
  destaque?: boolean
}

export default function AdminNovaLavanderia() {
  const { register, handleSubmit, reset, setFocus, watch } = useForm<Inputs>({
    defaultValues: { destaque: true },
  })

  const foto = watch("foto")

  useEffect(() => {
    setFocus("nome")
  }, [setFocus])

  function onSubmit(data: Inputs) {
    incluir(data)
  }

  async function incluir(data: Inputs) {
    try {
      const r = await fetch(`${apiUrl}/lavanderias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          nome: data.nome,
          foto: data.foto ?? null,
          endereco: data.endereco,
          destaque: data.destaque ?? true,
        }),
      })

      if (r.status === 201) {
        toast.success("Lavanderia cadastrada com sucesso")
        reset({ nome: "", foto: "", endereco: "", destaque: true })
        setFocus("nome")
      } else {
        const err = await r.json().catch(() => ({}))
        toast.error(err?.erro ?? "Erro no cadastro da lavanderia")
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    }
  }

  return (
    <div className="mt-24 px-6 max-w-4xl mx-auto">
      {/* Título */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
            Nova Lavanderia
          </span>
        </h1>
        <p className="mt-1 text-slate-600">
          Cadastre uma nova unidade. Você pode adicionar a foto (URL) e marcar como destaque.
        </p>
        <div className="mt-3 h-1.5 w-48 rounded-full bg-gradient-to-r from-sky-500 to-teal-500" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <section className="lg:col-span-2 rounded-2xl bg-white border border-sky-100 shadow p-6 space-y-4">
          <div>
            <label htmlFor="nome" className="block mb-1 text-sm font-medium text-slate-800">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              required
              {...register("nome")}
              className="w-full rounded-xl border-sky-100 bg-white px-3 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400 transition"
              placeholder="Ex.: Unidade Centro"
            />
          </div>

          <div>
            <label htmlFor="endereco" className="block mb-1 text-sm font-medium text-slate-800">
              Endereço
            </label>
            <input
              id="endereco"
              type="text"
              required
              {...register("endereco")}
              placeholder="Rua, número, bairro, cidade"
              className="w-full rounded-xl border-sky-100 bg-white px-3 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-teal-400/70 focus:border-teal-400 transition"
            />
          </div>

          <div>
            <label htmlFor="foto" className="block mb-1 text-sm font-medium text-slate-800">
              URL da Foto (opcional)
            </label>
            <input
              id="foto"
              type="url"
              {...register("foto")}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full rounded-xl border-sky-100 bg-white px-3 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400 transition"
            />
            {/* Preview da imagem */}
            {foto && foto.trim() !== "" && (
              <div className="mt-3">
                <img
                  src={foto}
                  onError={(e) => ((e.currentTarget.style.display = "none"))}
                  alt="Pré-visualização"
                  className="w-full h-40 object-cover rounded-xl ring-1 ring-sky-100"
                />
              </div>
            )}
          </div>

          {/* Destaque - switch */}
          <div className="pt-2">
            <label className="block mb-1 text-sm font-medium text-slate-800">Destaque</label>
            <div className="flex items-center gap-3">
              <input
                id="destaque"
                type="checkbox"
                className="peer sr-only"
                defaultChecked
                {...register("destaque")}
              />
              <label
                htmlFor="destaque"
                className="cursor-pointer inline-flex items-center h-6 w-11 rounded-full bg-slate-300
                           peer-checked:bg-emerald-500 transition-colors relative"
                title="Marcar como destaque"
              >
                <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow
                                  peer-checked:translate-x-5 transition-transform" />
              </label>
              <span className="text-sm text-slate-700">Marcar unidade como destaque</span>
            </div>
          </div>

          {/* Ações */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
                         shadow-sm hover:shadow-md transition cursor-pointer"
            >
              Incluir
            </button>

            <button
              type="button"
              onClick={() => reset({ nome: "", foto: "", endereco: "", destaque: true })}
              className="inline-flex items-center h-10 px-5 rounded-xl text-sm font-semibold
                         text-sky-700 bg-white ring-1 ring-sky-200 hover:bg-sky-50 transition"
            >
              Limpar
            </button>
          </div>
        </section>

        {/* Coluna lateral (Dica) */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-sky-100 shadow p-6">
            <h3 className="font-semibold text-slate-900">Boas práticas</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Utilize nomes claros: <b>“Unidade Centro”</b>, <b>“Unidade Sul”</b>.</li>
              <li>• Foto ajuda a destacar sua unidade na listagem.</li>
              <li>• Mantenha o endereço completo para facilitar reservas.</li>
            </ul>
            <div className="mt-4 rounded-xl bg-sky-50 ring-1 ring-sky-100 p-3 text-xs text-slate-600">
              Dica: URLs de imagens devem ser públicas e acessíveis.
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
