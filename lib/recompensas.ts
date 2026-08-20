import type { EstadoReferido, Trabajador } from "./tipos";

/** Programa de recompensas — la fuente única de verdad para las tres interfaces. */
export const PREMIO_PRIMER_DEPOSITO = 10;
export const PREMIO_CUARTO_DEPOSITO = 20;
export const PREMIO_PRIMERA_REMESA = 10;
export const TECHO_POR_TRABAJADOR =
  PREMIO_PRIMER_DEPOSITO + PREMIO_CUARTO_DEPOSITO + PREMIO_PRIMERA_REMESA; // $40

/** Beneficios para el titular de la cuenta Común. */
export const PREMIO_TITULAR_COMIDA = 10;

export type Hito = {
  clave: "primer_deposito" | "cuarto_deposito" | "primera_remesa";
  titulo: string;
  detalle: string;
  monto: number;
  logrado: boolean;
};

export function hitosDe(t: Trabajador): Hito[] {
  return [
    {
      clave: "primer_deposito",
      titulo: "Primer depósito directo",
      detalle: "La cuenta recibió su primer pago tuyo",
      monto: PREMIO_PRIMER_DEPOSITO,
      logrado: t.nDepositos >= 1,
    },
    {
      clave: "cuarto_deposito",
      titulo: "4 depósitos directos",
      detalle: "El trabajador ya cobra contigo de forma constante",
      monto: PREMIO_CUARTO_DEPOSITO,
      logrado: t.nDepositos >= 4,
    },
    {
      clave: "primera_remesa",
      titulo: "Primera remesa internacional",
      detalle: "Envió dinero a su país desde Común",
      monto: PREMIO_PRIMERA_REMESA,
      logrado: t.primeraRemesa,
    },
  ];
}

/** Lo que el socio ya ganó por este trabajador. */
export function recompensaGanada(t: Trabajador): number {
  return hitosDe(t).reduce((s, h) => s + (h.logrado ? h.monto : 0), 0);
}

/** Lo que falta por desbloquear (hasta el techo de $40). */
export function recompensaPendiente(t: Trabajador): number {
  return TECHO_POR_TRABAJADOR - recompensaGanada(t);
}

export function siguienteHito(t: Trabajador): Hito | null {
  return hitosDe(t).find((h) => !h.logrado) ?? null;
}

export function estadoDe(t: Trabajador): EstadoReferido {
  if (!t.cuentaCreada) return "enviada";
  if (t.nDepositos === 0) return "registrado_sin_deposito";
  return "activa_con_deposito";
}

export const ETIQUETA_ESTADO: Record<EstadoReferido, string> = {
  enviada: "Invitación enviada",
  registrado_sin_deposito: "Cuenta creada · sin depósito",
  activa_con_deposito: "Cuenta activa con depósito",
};

/** Dinero que el patrón le debe al trabajador: días no pagados × horas × tarifa. */
export function dineroAdeudado(t: Trabajador): number {
  if (!t.dias) return 0;
  return t.dias
    .filter((d) => !d.pagado)
    .reduce((s, d) => s + d.horas * t.tarifaHora, 0);
}

export function formatoUSD(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}
