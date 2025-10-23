import { Link } from "react-router-dom"
import type { MaquinaType } from "../utils/MaquinaType"

// Type guard para garantir string não vazia
function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0
}

export function CardMaquina({ data }: { data: MaquinaType }) {
  // Pega a foto da máquina, ou da lavanderia se a máquina não tiver
  const fotoUrl = isNonEmptyString(data?.foto)
    ? data.foto.trim()
    : isNonEmptyString(data?.lavanderia?.foto)
    ? data.lavanderia.foto.trim()
    : undefined

  return (
    <div className="bg-red dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
      {fotoUrl ? (
        <img
          className="w-full h-48 object-cover"
          src={fotoUrl}
          alt={`Foto da máquina ou lavanderia ${data?.lavanderia?.nome ?? ""}`}
          onError={(e) => {
            // Se a imagem falhar, esconde o elemento
            e.currentTarget.style.display = "none"
          }}
        />
      ) : (
        // Fallback visual quando não existe foto
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Sem foto disponível
          </span>
        </div>
      )}

      <div className="p-5 space-y-2">
        <h5 className="text-xl font-bold tracking-tight text-sky-700 dark:text-white">
          {data?.tipo === "LAVAR" ? "Máquina de Lavar" : "Máquina de Secar"}
        </h5>

        <p className="text-slate-700 dark:text-slate-200 text-sm">
          <span className="font-semibold">Lavanderia:</span>{" "}
          {data?.lavanderia?.nome ?? "—"}
        </p>

        <p className="text-slate-700 dark:text-slate-200 text-sm">
          <span className="font-semibold">Endereço:</span>{" "}
          {data?.lavanderia?.endereco ?? "—"}
        </p>

        <p
          className={`text-sm font-semibold ${
            data.ativa ? "text-green-600" : "text-red-500"
          }`}
        >
          {data.ativa ? "Ativa" : "Inativa"}
        </p>

        <Link
          to={`/detalhes/${data?.id}`}
          className="inline-flex items-center justify-center w-full mt-3 px-4 py-2 
             bg-sky-600 hover:bg-cyan-500 text-white font-medium rounded-xl 
             transition-colors duration-300 cursor-pointer"
        >
          Ver detalhes →
        </Link>
      </div>
    </div>
  )
}
