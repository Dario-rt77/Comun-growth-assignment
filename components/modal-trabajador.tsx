"use client";

import { useEffect } from "react";
import type { Trabajador } from "@/lib/tipos";
import {
  ETIQUETA_ESTADO,
  TECHO_POR_TRABAJADOR,
  dineroAdeudado,
  estadoDe,
  formatoUSD,
  hitosDe,
  recompensaGanada,
} from "@/lib/recompensas";
import { BarraProgreso, Boton, Campo, Insignia } from "./ui";

const DIAS_SEMANA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function etiquetaDia(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return `${DIAS_SEMANA[d.getUTCDay()]} ${d.getUTCDate()}`;
}

export function ModalTrabajador({
  trabajador,
  onCerrar,
  onCambio,
}: {
  trabajador: Trabajador;
  onCerrar: () => void;
  onCambio: (t: Trabajador) => void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  const t = trabajador;
  const dias = t.dias ?? [];
  const adeudado = dineroAdeudado(t);
  const ganada = recompensaGanada(t);
  const horasPendientes = dias.filter((d) => !d.pagado).reduce((s, d) => s + d.horas, 0);

  const set = (parcial: Partial<Trabajador>) => onCambio({ ...t, ...parcial });

  const setDia = (i: number, parcial: Partial<(typeof dias)[number]>) =>
    set({ dias: dias.map((d, j) => (j === i ? { ...d, ...parcial } : d)) });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-verde/40 p-0 sm:items-center sm:p-6"
      onClick={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-crema sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gris-borde bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-extrabold leading-tight text-verde">{t.nombre}</h2>
            <div className="mt-2">
              <Insignia estado={estadoDe(t)} texto={ETIQUETA_ESTADO[estadoDe(t)]} />
            </div>
          </div>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="shrink-0 rounded-full bg-gris px-3 py-1.5 text-lg leading-none text-gris-texto hover:bg-gris-borde"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Nombre" value={t.nombre} onChange={(e) => set({ nombre: e.target.value })} />
            <Campo etiqueta="Teléfono" value={t.telefono} onChange={(e) => set({ telefono: e.target.value })} />
            <Campo
              etiqueta="Cuenta registrada"
              value={t.cuenta ?? ""}
              placeholder="Sin cuenta todavía"
              disabled={!t.cuentaCreada}
              onChange={(e) => set({ cuenta: e.target.value })}
              ayuda={t.cuentaCreada ? undefined : "Se llena cuando abra su cuenta Común."}
            />
            <Campo
              etiqueta="Tarifa por hora (USD)"
              type="number"
              min={0}
              value={t.tarifaHora}
              onChange={(e) => set({ tarifaHora: Number(e.target.value) || 0 })}
            />
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-extrabold text-verde">Semana del 10 al 15 de agosto</h3>
              <span className="text-xs text-gris-texto">Marca los días ya pagados</span>
            </div>

            <div className="overflow-hidden rounded-tarjeta border border-gris-borde bg-white">
              {dias.map((d, i) => (
                <div
                  key={d.fecha}
                  className="flex items-center gap-3 border-b border-gris-borde px-4 py-3 last:border-0"
                >
                  <span className="w-16 text-sm font-semibold capitalize text-verde">
                    {etiquetaDia(d.fecha)}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={d.horas}
                    onChange={(e) => setDia(i, { horas: Number(e.target.value) || 0 })}
                    className="w-20 rounded-xl border-2 border-gris-borde px-3 py-1.5 text-sm text-verde outline-none focus:border-verde"
                  />
                  <span className="text-sm text-gris-texto">hrs</span>
                  <span className="ml-auto text-sm font-medium text-gris-texto">
                    {formatoUSD(d.horas * t.tarifaHora)}
                  </span>
                  <button
                    onClick={() => setDia(i, { pagado: !d.pagado })}
                    className={`w-24 shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      d.pagado
                        ? "bg-menta text-[#0d6b43]"
                        : "border border-gris-borde bg-white text-gris-texto hover:border-verde"
                    }`}
                  >
                    {d.pagado ? "✓ Pagado" : "Sin pagar"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-tarjeta bg-lima px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-verde/70">Le debes</p>
                <p className="text-xs text-verde/60">{horasPendientes} hrs sin pagar</p>
              </div>
              <p className="text-3xl font-extrabold text-verde">{formatoUSD(adeudado)}</p>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-extrabold text-verde">Tu recompensa por {t.nombre.split(" ")[0]}</h3>
              <span className="text-sm font-bold text-verde">
                {formatoUSD(ganada)} de {formatoUSD(TECHO_POR_TRABAJADOR)}
              </span>
            </div>
            <BarraProgreso valor={ganada} max={TECHO_POR_TRABAJADOR} className="mb-4" />
            <div className="space-y-2">
              {hitosDe(t).map((h) => (
                <div
                  key={h.clave}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                    h.logrado ? "border-transparent bg-menta" : "border-gris-borde bg-white"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      h.logrado ? "bg-verde text-white" : "bg-gris text-gris-texto"
                    }`}
                  >
                    {h.logrado ? "✓" : ""}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-verde">{h.titulo}</p>
                    <p className="truncate text-xs text-gris-texto">{h.detalle}</p>
                  </div>
                  <span className="ml-auto font-extrabold text-verde">{formatoUSD(h.monto)}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gris-texto">
              Depósitos directos hechos a esta cuenta: <strong>{t.nDepositos}</strong>
            </p>
          </section>

          <Boton onClick={onCerrar} className="w-full">Guardar y cerrar</Boton>
        </div>
      </div>
    </div>
  );
}
