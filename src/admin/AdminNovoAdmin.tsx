import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAdminStore } from "./context/AdminContext"
import { useState } from "react"
import { Eye, EyeOff, UserPlus } from "lucide-react"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = { nome: string; email: string; senha: string; nivel: number }

export default function AdminNovoAdmin() {
  const { register, handleSubmit, reset } = useForm<Inputs>({ defaultValues: { nivel: 3 }, mode: "onChange" })
  const navigate = useNavigate()
  const { admin } = useAdminStore()
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(data: Inputs) {
    try {
      setSubmitting(true)
      const resp = await fetch(`${apiUrl}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin?.token ?? localStorage.getItem("adminToken") ?? ""}`,
        },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          nivel: Number(data.nivel),
        }),
      })

      if (resp.ok) {
        toast.success("Administrador criado com sucesso!")
        reset()
        navigate("/admin/cadAdmin", { replace: true })
      } else {
        const err = await resp.json().catch(() => ({}))
        const detalhes =
          err?.detalhes &&
          Object.values(err.detalhes as Record<string, string[]>)
            .flat()
            .join(", ")
        toast.error(err?.erro || detalhes || "Erro ao criar administrador")
      }
    } catch {
      toast.error("Erro de conexão")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-28 px-4 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
            Novo Administrador
          </span>
        </h1>
        <p className="mt-1 text-slate-600">Crie um novo acesso com o nível apropriado de permissão.</p>
        <div className="mt-3 h-1.5 w-44 rounded-full bg-gradient-to-r from-sky-500 to-teal-500" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="lg:col-span-1 rounded-2xl bg-white border border-sky-100 shadow p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Dados básicos</h2>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-800">Nome</label>
            <input
              type="text"
              className="w-full rounded-xl border-sky-100 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400 transition"
              placeholder="Ex.: Ana Silva"
              required
              {...register("nome")}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-800">E-mail</label>
            <input
              type="email"
              className="w-full rounded-xl border-sky-100 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400 transition"
              placeholder="ana@empresa.com"
              required
              {...register("email")}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-800">Senha</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full rounded-xl border-sky-100 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400 transition"
                placeholder="Mín. 8, com maiúscula, minúscula, número e símbolo"
                required
                {...register("senha")}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                title={showPass ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </section>

        <section className="lg:col-span-1 rounded-2xl bg-white border border-sky-100 shadow p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Permissões</h2>
          <p className="text-xs text-slate-500">
            Recomenda-se iniciar novos administradores no <b>Nível 3</b>. Ajuste conforme responsabilidade.
          </p>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-800">Nível (1 a 5)</label>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full rounded-xl border-sky-100 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-400/70 focus:border-teal-400 transition"
              required
              defaultValue={3}
              {...register("nivel", { valueAsNumber: true })}
            />
            <ul className="mt-2 text-xs text-slate-500 space-y-1">
              <li><b>Nível 1</b>: Leitura</li>
              <li><b>Nível 2</b>: Operacional</li>
              <li><b>Nível 3</b>: Padrão (recomendado)</li>
              <li><b>Nível 4</b>: Gerencial</li>
              <li><b>Nível 5</b>: Super Admin</li>
            </ul>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 shadow-sm hover:shadow-md transition disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Salvar
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center h-10 px-5 rounded-xl text-sm font-semibold text-sky-700 bg-white ring-1 ring-sky-200 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 transition"
            >
              Cancelar
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
