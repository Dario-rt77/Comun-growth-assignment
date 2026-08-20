"use client";

import { useMemo, useState } from "react";
import { SOCIO_DEMO } from "@/lib/demo-socio";
import type { Trabajador } from "@/lib/tipos";
import {
  ETIQUETA_ESTADO,
  TECHO_POR_TRABAJADOR,
  dineroAdeudado,
  estadoDe,
  formatoUSD,
  recompensaGanada,
  siguienteHito,
} from "@/lib/recompensas";
import { BarraProgreso, Insignia, LogoComun, Stat, Tarjeta } from "./ui";
import { ModalTrabajador } from "./modal-trabajador";
import { ModalInvitar } from "./modal-invitar";

export function PanelSocio() {
  const socio = SOCIO_DEMO;
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(socio.trabajadores);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [invitando, setInvitando] = useState(false);

  const m = useMemo(() => {
    const registrados = trabajadores.filter((t) => t.cuentaCreada).length;
    const activos = trabajadores.filter((t) => estadoDe(t) === "activa_con_deposito").length;
    const ganadas = trabajadores.reduce((s, t) => s + recompensaGanada(t), 0);
    return {
      enviados: trabajadores.length,
      pendientes: trabajadores.length - registrados,
      sinDeposito: registrados - activos,
      activos,
      depositos: trabajadores.reduce((s, t) => s + t.nDepositos, 0),
      ganadas,
      techo: trabajadores.length * TECHO_POR_TRABAJADOR,
      adeudado: trabajadores.reduce((s, t) => s + dineroAdeudado(t), 0),
      pagado: trabajadores.reduce(
        (s, t) =>
          s +
          (t.dias ?? [])
            .filter((d) => d.pagado)
            .reduce((n, d) => n + d.horas * t.tarifaHora, 0),
        0,
      ),
      pagosPendientes: trabajadores.filter((t) => dineroAdeudado(t) > 0).length,
    };
  }, [trabajadores]);

  const actual = trabajadores.find((t) => t.id === abierto) ?? null;


  return (
    <main className="min-h-dvh bg-crema pb-20">
      <header className="flex items-center justify-between border-b border-gris-borde bg-white px-6 py-4">
        <a href="https://www.comun.app"><LogoComun /></a>
        <span className="rounded-full bg-gris px-4 py-1.5 text-sm font-semibold text-gris-texto">
          Portal de socios
        </span>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-gris-texto">
          Bienvenido de vuelta
        </p>
        <h1 className="titular mt-2 text-3xl sm:text-4xl">{socio.empresa}</h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-verde px-4 py-2 text-sm font-bold text-white">
            Tu código: {socio.codigo}
          </span>
          <button
            onClick={() => setInvitando(true)}
            className="rounded-full bg-lima px-5 py-2 text-sm font-bold text-verde transition hover:brightness-95"
          >
            Invitar a cuenta Común
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat valor={m.enviados} etiqueta="Invitaciones enviadas" />
          <Stat valor={m.pendientes} etiqueta="Pendientes de registrarse" />
          <Stat valor={m.sinDeposito} etiqueta="Cuenta creada · sin depósito" />
          <Stat valor={m.activos} etiqueta="Cuentas activas con depósito" tono="exito" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Tarjeta className="lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-extrabold text-verde">Tus recompensas</h2>
              <span className="text-sm text-gris-texto">
                Máximo {formatoUSD(TECHO_POR_TRABAJADOR)} por trabajador
              </span>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-verde">{formatoUSD(m.ganadas)}</p>
            <p className="mt-1 text-sm text-gris-texto">
              ganados de {formatoUSD(m.techo)} posibles con tu cuadrilla actual
            </p>
            <BarraProgreso valor={m.ganadas} max={m.techo} className="mt-4" />
            <p className="mt-4 rounded-2xl bg-ambar px-4 py-3 text-sm leading-relaxed text-verde">
              <strong>{m.sinDeposito} trabajadores</strong> ya abrieron su cuenta pero
              no han recibido su primer depósito tuyo. Son{" "}
              <strong>{formatoUSD(m.sinDeposito * 10)}</strong> esperándote.
            </p>
          </Tarjeta>

          <Tarjeta>
            <h2 className="text-lg font-extrabold text-verde">Nómina de la semana</h2>

            <p className="mt-4 text-sm text-gris-texto">Ya pagado</p>
            <p className="text-3xl font-extrabold text-verde">{formatoUSD(m.pagado)}</p>

            <p className="mt-4 text-sm text-gris-texto">Pendiente por pagar</p>
            <p className="text-3xl font-extrabold text-verde">{formatoUSD(m.adeudado)}</p>

            <p className="mt-5 text-sm leading-relaxed text-gris-texto">
              Te faltan{" "}
              <strong className="text-verde">{m.pagosPendientes} pagos</strong>{" "}
              por enviar esta semana.
            </p>
          </Tarjeta>
        </div>

        <h2 className="titular mt-12 text-2xl">Tu cuadrilla</h2>
        <p className="mt-1.5 text-sm text-gris-texto">
          Toca a cualquier trabajador para ver o editar sus horas y su pago.
        </p>

        <div className="mt-5 overflow-hidden rounded-tarjeta border border-gris-borde bg-white">
          <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_6rem_8rem_8rem] gap-4 border-b border-gris-borde bg-gris px-5 py-3 text-xs font-bold uppercase tracking-wide text-gris-texto lg:grid">
            <span>Trabajador</span>
            <span>Estado</span>
            <span className="text-right">Depósitos</span>
            <span className="text-right">Le debes</span>
            <span className="text-right">Ganaste</span>
          </div>

          {trabajadores.map((t) => {
            const sig = siguienteHito(t);
            return (
              <button
                key={t.id}
                onClick={() => setAbierto(t.id)}
                className="grid w-full grid-cols-1 gap-2 border-b border-gris-borde px-5 py-4 text-left transition last:border-0 hover:bg-crema lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_6rem_8rem_8rem] lg:items-center lg:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-verde">{t.nombre}</p>
                  <p className="truncate text-xs text-gris-texto">
                    {t.cuenta ?? "Sin cuenta"} · {formatoUSD(t.tarifaHora)}/hr
                    {sig && ` · Sigue: ${sig.titulo.toLowerCase()}`}
                  </p>
                </div>
                <div>
                  <Insignia estado={estadoDe(t)} texto={ETIQUETA_ESTADO[estadoDe(t)]} />
                </div>
                <span className="text-sm text-gris-texto lg:text-right lg:tabular-nums">
                  <span className="lg:hidden">Depósitos: </span>
                  {t.nDepositos}
                </span>
                <span className="text-sm font-semibold text-verde lg:text-right lg:tabular-nums">
                  <span className="font-normal text-gris-texto lg:hidden">Le debes: </span>
                  {formatoUSD(dineroAdeudado(t))}
                </span>
                <span className="text-sm font-extrabold text-verde lg:text-right lg:tabular-nums">
                  <span className="font-normal text-gris-texto lg:hidden">Ganaste: </span>
                  {formatoUSD(recompensaGanada(t))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {invitando && (
        <ModalInvitar empresa={socio.empresa} onCerrar={() => setInvitando(false)} />
      )}

      {actual && (
        <ModalTrabajador
          trabajador={actual}
          onCerrar={() => setAbierto(null)}
          onCambio={(t) =>
            setTrabajadores((prev) => prev.map((x) => (x.id === t.id ? t : x)))
          }
        />
      )}
    </main>
  );
}
