import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { FiSearch } from "react-icons/fi"
import type { LavanderiaType } from "../utils/LavanderiaType"
import { useAdminStore } from "./context/AdminContext"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  tipo: "LAVAR" | "SECAR"
  lavanderiaId: number | ""
  ativa: boolean
}

export default function AdminNovaMaquina() {
  const [lavanderias, setLavanderias] = useState<LavanderiaType[]>([])
  const [loadingLav, setLoadingLav] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const { admin } = useAdminStore()

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { tipo: "LAVAR", ativa: true, lavanderiaId: "" },
    mode: "onChange",
  })

  const tipo = watch("tipo")
  const lavanderiaId = watch("lavanderiaId")
  const ativa = watch("ativa")

  useEffect(() => {
    async function getLavanderias() {
      try {
        setLoadingLav(true)
        const response = await fetch(`${apiUrl}/lavanderias`)
        const dados = await response.json()
        setLavanderias(Array.isArray(dados) ? dados : [])
      } catch {
        setLavanderias([])
        toast.error("Não foi possível carregar as lavanderias.")
      } finally {
        setLoadingLav(false)
      }
    }
    getLavanderias()
    setFocus("tipo")
  }, [setFocus])

  const filteredLav = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return lavanderias
    return lavanderias.filter(
      (l) =>
        l.nome?.toLowerCase().includes(q) ||
        l.endereco?.toLowerCase().includes(q)
    )
  }, [lavanderias, search])

  const selectedLav = useMemo(
    () => lavanderias.find((l) => String(l.id) === String(lavanderiaId)) || null,
    [lavanderias, lavanderiaId]
  )

  async function incluirMaquina(data: Inputs) {
    if (data.lavanderiaId === "" || isNaN(Number(data.lavanderiaId))) {
      toast.error("Selecione uma lavanderia válida.")
      return
    }

    const body = {
      tipo: data.tipo,
      lavanderiaId: Number(data.lavanderiaId),
      ativa: !!data.ativa, // agora sempre vem do RHF
      // adminId: admin.id, // opcional: o back já lê do token
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${apiUrl}/maquinas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(body),
      })

      if (response.status === 201) {
        toast.success("🚀 Máquina cadastrada com sucesso!")
        reset({ tipo: "LAVAR", lavanderiaId: "", ativa: true })
        setSearch("")
      } else {
        const erro = await response.json().catch(() => ({}))
        const detalhes =
          erro?.detalhes &&
          Object.values(erro.detalhes)
            .flat()
            .join(", ")
        toast.error(erro?.erro || detalhes || "Erro no cadastro da Máquina...")
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-4 mt-28 mb-16">
      {/* Breadcrumb + título */}
      <div className="mb-6">
        <nav className="text-sm text-slate-500">
          <ol className="flex items-center gap-1">
            <li>Admin</li>
            <li className="opacity-60">/</li>
            <li>Máquinas</li>
            <li className="opacity-60">/</li>
            <li className="text-slate-700 font-medium">Nova</li>
          </ol>
        </nav>

        <div className="mt-2 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                Inclusão de Máquinas
              </span>
            </h1>
            <p className="mt-1 text-slate-600">
              Cadastre novos equipamentos e mantenha suas unidades operando no pico.
            </p>
          </div>
          <div className="text-xs text-slate-500 max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 ring-1 ring-sky-100 px-3 py-1">
              Dica: mantenha <b>nomes e endereços atualizados</b> para facilitar reservas.
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-48 rounded-full bg-gradient-to-r from-sky-500 to-teal-500" />
      </div>

      {/* GRID: esquerda (form) | direita (aside) */}
      <form onSubmit={handleSubmit(incluirMaquina)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tipo */}
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl bg-white border border-sky-100 shadow p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Tipo da máquina</h2>
              <span className="text-xs text-slate-500">
                Escolha o tipo ideal para a operação desta unidade.
              </span>
            </div>

            <div className="mt-4 inline-flex rounded-xl ring-1 ring-sky-100 p-1 bg-sky-50">
              {(["LAVAR", "SECAR"] as const).map((op) => {
                const active = tipo === op
                return (
                  <button
                    key={op}
                    type="button"
                    onClick={async () => {
                      setValue("tipo", op, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                      await trigger("tipo")
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                      active ? "bg-white text-sky-700 shadow-sm" : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {op === "LAVAR" ? "Lavar" : "Secar"}
                  </button>
                )
              })}
            </div>

            {/* Select “fantasma” para acessibilidade */}
            <select
              id="tipo"
              className="sr-only"
              aria-hidden
              {...register("tipo", { required: "Selecione o tipo" })}
              value={tipo}
              onChange={(e) => {
                const v = e.target.value as "LAVAR" | "SECAR"
                setValue("tipo", v, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
              }}
            >
              <option value="LAVAR">LAVAR</option>
              <option value="SECAR">SECAR</option>
            </select>
            {errors.tipo && <p className="mt-2 text-xs text-red-600">{errors.tipo.message}</p>}
          </motion.section>

          {/* Vincular lavanderia */}
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl bg-white border border-sky-100 shadow p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Vincular lavanderia</h2>
              <span className="text-xs text-slate-500">A máquina será disponibilizada para reservas nesta unidade.</span>
            </div>

            {/* Busca com ícone profissional */}
            <div className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nome ou endereço..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border-sky-100 bg-white px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-400 transition"
                />
                <FiSearch className="absolute left-3 top-3.5 text-slate-400 text-lg pointer-events-none" />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="lavanderiaId" className="block text-sm font-medium text-slate-800 mb-1">
                Lavanderia
              </label>
              <select
                id="lavanderiaId"
                className="w-full rounded-xl border-sky-100 bg-white text-slate-900 text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-400/70 focus:border-teal-400 transition cursor-pointer"
                {...register("lavanderiaId", { validate: (v) => v !== "" || "Selecione uma lavanderia" })}
                value={lavanderiaId}
                onChange={(e) => {
                  const raw = e.target.value
                  const parsed = raw === "" ? "" : Number(raw)
                  setValue("lavanderiaId", parsed as any, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                  trigger("lavanderiaId")
                }}
              >
                <option value="">Selecione...</option>
                {loadingLav ? (
                  <option disabled>Carregando...</option>
                ) : filteredLav.length === 0 ? (
                  <option disabled>Nenhum resultado</option>
                ) : (
                  filteredLav.map((lav) => (
                    <option key={lav.id} value={lav.id}>
                      {lav.nome} — {lav.endereco}
                    </option>
                  ))
                )}
              </select>
              {errors.lavanderiaId && (
                <p className="mt-2 text-xs text-red-600">{String(errors.lavanderiaId.message)}</p>
              )}
            </div>
          </motion.section>

          {/* Disponibilidade */}
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl bg-white border border-sky-100 shadow p-6"
          >
            <h2 className="font-semibold text-slate-900">Disponibilidade</h2>
            <p className="text-xs text-slate-500">Ative para permitir reservas imediatamente após o cadastro.</p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 ${
                  ativa ? "bg-emerald-500 focus:ring-emerald-300" : "bg-slate-400 focus:ring-slate-300"
                }`}
                onClick={() =>
                  setValue("ativa", !ativa, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                    ativa ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-slate-800 select-none">
                {ativa ? "Ativa" : "Inativa"}
              </label>
            </div>

            {/* Campo invisível para o RHF receber o valor de `ativa` */}
            <input
              type="checkbox"
              className="sr-only"
              aria-hidden
              {...register("ativa")}
              checked={!!ativa}
              onChange={(e) =>
                setValue("ativa", e.target.checked, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />
          </motion.section>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 cursor-pointer text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 focus:ring-4 focus:ring-sky-300 font-semibold rounded-xl text-sm px-6 py-2.5 shadow-sm hover:shadow-md transition disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  Enviando...
                </>
              ) : (
                <>
                  <span className="text-base leading-none">＋</span>
                  Incluir
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                reset({ tipo: "LAVAR", lavanderiaId: "", ativa: true })
                setSearch("")
              }}
              className="inline-flex items-center gap-2 cursor-pointer text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-100 font-semibold rounded-xl text-sm px-4 py-2.5 transition"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Coluna lateral */}
        <aside className="space-y-6">
          {/* Resumo do cadastro */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.02 }}
            className="rounded-2xl bg-white border border-sky-100 shadow p-6"
          >
            <h3 className="font-semibold text-slate-900">Resumo do cadastro</h3>
            <p className="text-xs text-slate-500">Revise antes de enviar. Você pode ajustar depois.</p>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <dt className="w-28 text-slate-500">Tipo</dt>
                <dd className="font-medium text-slate-800">{tipo === "SECAR" ? "Secar" : "Lavar"}</dd>
              </div>

              <div className="flex items-start gap-3">
                <dt className="w-28 text-slate-500">Lavanderia</dt>
                <dd className="font-medium text-slate-800">
                  {selectedLav ? (
                    <>
                      <div>{selectedLav.nome}</div>
                      <div className="text-xs text-slate-500">{selectedLav.endereco}</div>
                    </>
                  ) : (
                    <span className="text-slate-400">Não selecionada</span>
                  )}
                </dd>
              </div>

              <div className="flex items-start gap-3">
                <dt className="w-28 text-slate-500">Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${
                      ativa ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-700 ring-slate-200"
                    }`}
                  >
                    {ativa ? "Ativa" : "Inativa"}
                  </span>
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Boas práticas */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-2xl bg-white border border-sky-100 shadow p-6"
          >
            <h3 className="font-semibold text-slate-900">Boas práticas</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Cadastre equipamentos com o <b>tipo correto</b> para evitar conflitos de agenda.</li>
              <li>• Mantenha a unidade <b>Ativa</b> apenas quando houver disponibilidade real.</li>
              <li>• Revise endereço e nome da lavanderia para garantir uma <b>busca eficiente</b> dos clientes.</li>
            </ul>

            <details className="mt-3 rounded-xl bg-sky-50/60 border border-sky-100 px-3 py-2 text-sm text-slate-700">
              <summary className="cursor-pointer select-none">Como devo nomear minhas unidades?</summary>
              <div className="mt-2 text-slate-600">
                Use um padrão como <b>“Unidade Centro - Rua X, 123”</b>. Facilita suporte e relatórios.
              </div>
            </details>
          </motion.div>

          {/* Preview opcional */}
          {selectedLav?.foto && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="rounded-2xl bg-white border border-sky-100 shadow p-6"
            >
              <h3 className="font-semibold text-slate-900">Preview da Lavanderia</h3>
              <img
                src={selectedLav.foto}
                alt="Lavanderia"
                className="mt-3 w-full h-36 object-cover rounded-xl ring-1 ring-sky-100"
              />
            </motion.div>
          )}
        </aside>
      </form>
    </div>
  )
}
