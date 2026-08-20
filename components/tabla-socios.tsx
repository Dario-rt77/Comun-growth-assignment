"use client";

import { useMemo, useState } from "react";
import { formatoUSD } from "@/lib/recompensas";

export type Fila = {
  id: string;
  empresa: string;
  ciudad: string;
  estado: string;
  codigo: string;
  enviados: number;
  registrados: number;
  activos: number;
  depositos: number;
  ganadas: number;
  tasaActivacion: number;
  puntajeValor: number;
};

type Columna = "empresa" | "enviados" | "activos" | "tasaActivacion" | "ganadas" | "puntajeValor";

const COLUMNAS: { clave: Columna; titulo: string; numerica: boolean }[] = [
  { clave: "empresa", titulo: "Socio", numerica: false },
  { clave: "enviados", titulo: "Invitaciones", numerica: true },
  { clave: "activos", titulo: "Cuentas activas", numerica: true },
  { clave: "tasaActivacion", titulo: "Activación", numerica: true },
  { clave: "ganadas", titulo: "Recompensas", numerica: true },
  { clave: "puntajeValor", titulo: "Puntaje de valor", numerica: true },
];

const POR_PAGINA = 12;

export function TablaSocios({ filas }: { filas: Fila[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Columna>("puntajeValor");
  const [pagina, setPagina] = useState(0);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const base = q
      ? filas.filter(
          (f) =>
            f.empresa.toLowerCase().includes(q) ||
            f.ciudad.toLowerCase().includes(q) ||
            f.codigo.toLowerCase().includes(q),
        )
      : filas;
    return [...base].sort((a, b) =>
      orden === "empresa"
        ? a.empresa.localeCompare(b.empresa)
        : (b[orden] as number) - (a[orden] as number),
    );
  }, [filas, busqueda, orden]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const p = Math.min(pagina, totalPaginas - 1);
  const visibles = filtradas.slice(p * POR_PAGINA, (p + 1) * POR_PAGINA);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(0);
          }}
          placeholder="Buscar por empresa, ciudad o código…"
          className="w-full max-w-sm rounded-full border-2 border-gris-borde bg-white px-5 py-2.5 text-sm text-verde outline-none focus:border-verde"
        />
        <span className="text-sm text-gris-texto">
          {filtradas.length.toLocaleString("es-MX")} socios
        </span>
      </div>

      <div className="overflow-x-auto rounded-tarjeta border border-gris-borde bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-gris-borde bg-gris">
              {COLUMNAS.map((c) => (
                <th
                  key={c.clave}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-gris-texto ${
                    c.numerica ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    onClick={() => {
                      setOrden(c.clave);
                      setPagina(0);
                    }}
                    className={`transition hover:text-verde ${
                      orden === c.clave ? "text-verde underline" : ""
                    }`}
                  >
                    {c.titulo}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((f) => (
              <tr key={f.id} className="border-b border-gris-borde last:border-0 hover:bg-crema">
                <td className="px-4 py-3">
                  <p className="font-bold text-verde">{f.empresa}</p>
                  <p className="text-xs text-gris-texto">
                    {f.ciudad}, {f.estado} · {f.codigo}
                  </p>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-gris-texto">{f.enviados}</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-verde">
                  {f.activos}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-gris-texto">
                  {Math.round(f.tasaActivacion * 100)}%
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-verde">
                  {formatoUSD(f.ganadas)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-block rounded-full bg-lima px-3 py-1 text-xs font-extrabold tabular-nums text-verde">
                    {f.puntajeValor.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gris-texto">
          Página {p + 1} de {totalPaginas.toLocaleString("es-MX")}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPagina(Math.max(0, p - 1))}
            disabled={p === 0}
            className="rounded-full border-2 border-gris-borde px-4 py-2 text-sm font-semibold text-verde transition hover:border-verde disabled:opacity-40"
          >
            ← Anterior
          </button>
          <button
            onClick={() => setPagina(Math.min(totalPaginas - 1, p + 1))}
            disabled={p >= totalPaginas - 1}
            className="rounded-full border-2 border-gris-borde px-4 py-2 text-sm font-semibold text-verde transition hover:border-verde disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
