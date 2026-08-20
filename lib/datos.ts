import type { MetricasSocio, Socio, Trabajador } from "./tipos";
import { SOCIO_DEMO } from "./demo-socio";
import {
  estadoDe,
  recompensaGanada,
  recompensaPendiente,
  TECHO_POR_TRABAJADOR,
} from "./recompensas";

/* ------------------------------------------------------------------ *
 * Generador determinista. Misma semilla -> mismos datos en cada carga,
 * así el demo es estable sin comprometer un JSON de varios MB al repo.
 * ------------------------------------------------------------------ */
function mulberry32(semilla: number) {
  let a = semilla;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CIUDADES: [string, string][] = [
  ["Houston", "TX"], ["Dallas", "TX"], ["San Antonio", "TX"], ["Austin", "TX"],
  ["Phoenix", "AZ"], ["Tucson", "AZ"], ["Los Ángeles", "CA"], ["Riverside", "CA"],
  ["Fresno", "CA"], ["San Diego", "CA"], ["Miami", "FL"], ["Orlando", "FL"],
  ["Tampa", "FL"], ["Chicago", "IL"], ["Atlanta", "GA"], ["Charlotte", "NC"],
  ["Raleigh", "NC"], ["Las Vegas", "NV"], ["Denver", "CO"], ["Nashville", "TN"],
];

const OFICIOS = [
  "Plomería", "Techos", "Construcciones", "Drywall", "Pintura", "Electricidad",
  "Concreto", "Remodelaciones", "Jardinería", "Pisos y Azulejos", "Climatización",
  "Estructuras", "Acabados", "Carpintería", "Instalaciones",
];

const APELLIDOS = [
  "Gómez", "Hernández", "Martínez", "López", "Ramírez", "Torres", "Flores",
  "Rivera", "Morales", "Castillo", "Vargas", "Mendoza", "Guzmán", "Núñez",
  "Salazar", "Cabrera", "Delgado", "Peña", "Ibarra", "Quintero", "Rojas",
  "Sandoval", "Aguilar", "Bautista", "Cordero", "Escobar", "Fuentes", "Herrera",
];

const NOMBRES = [
  "José", "Luis", "Carlos", "Miguel", "Juan", "Pedro", "Antonio", "Francisco",
  "Manuel", "Jorge", "Rafael", "Óscar", "Héctor", "Andrés", "Javier", "Rubén",
  "María", "Rosa", "Ana", "Carmen", "Lucía", "Gloria", "Patricia", "Elena",
];

const SUFIJOS = ["LLC", "Inc.", "& Hijos", "Group", "Services", "Co."];

function elige<T>(r: () => number, xs: T[]): T {
  return xs[Math.floor(r() * xs.length)];
}

function enteroEntre(r: () => number, min: number, max: number): number {
  return min + Math.floor(r() * (max - min + 1));
}

/**
 * Calidad del socio: sesgada hacia abajo a propósito. La mayoría de socios
 * activan poco y unos pocos concentran el valor — sin esa cola larga el
 * dashboard de admin no tendría nada interesante que mostrar.
 */
function calidad(r: () => number): number {
  return Math.pow(r(), 2.2);
}

/**
 * Tasas base del embudo. Se extraen como parámetros para poder calibrarlas
 * contra la meta pública de cuentas activas sin tocar el resto del generador.
 */
export const BASE_REGISTRO = 0.826;
export const BASE_ACTIVACION = 0.802;
/** Escala cuántos empleados de la cuadrilla reciben invitación. */
export const FACTOR_REFERIDOS = 1.1593;

function generarTrabajadores(
  r: () => number,
  socioId: string,
  n: number,
  q: number,
  baseRegistro = BASE_REGISTRO,
  baseActivacion = BASE_ACTIVACION,
): Trabajador[] {
  const tasaRegistro = baseRegistro + q * 0.17;
  const tasaActivacion = baseActivacion + q * 0.18;
  const out: Trabajador[] = [];

  for (let i = 0; i < n; i++) {
    // Todos los sorteos se consumen siempre, aunque no se usen: así el flujo
    // del PRNG no cambia al recalibrar las tasas y el total de invitaciones
    // se mantiene estable.
    const sorteoRegistro = r();
    const sorteoActivacion = r();
    const sorteoDepositos = enteroEntre(r, 1, 2 + Math.round(q * 12));
    const sorteoRemesa = r();
    const sorteoPresencial = r();
    const sorteoTelefono1 = enteroEntre(r, 200, 989);
    const sorteoTelefono2 = enteroEntre(r, 200, 999);
    const sorteoTelefono3 = enteroEntre(r, 0, 9999);
    const sorteoCuenta = enteroEntre(r, 0, 9999);
    const sorteoTarifa = enteroEntre(r, 18, 34);
    const nombre = `${elige(r, NOMBRES)} ${elige(r, APELLIDOS)}`;

    const cuentaCreada = sorteoRegistro < tasaRegistro;
    const activo = cuentaCreada && sorteoActivacion < tasaActivacion;
    const nDepositos = activo ? sorteoDepositos : 0;

    out.push({
      id: `${socioId}-t${i + 1}`,
      socioId,
      nombre,
      telefono: `(${sorteoTelefono1}) ${sorteoTelefono2}-${String(sorteoTelefono3).padStart(4, "0")}`,
      cuenta: cuentaCreada ? `•••• ${String(sorteoCuenta).padStart(4, "0")}` : null,
      tarifaHora: sorteoTarifa,
      cuentaCreada,
      nDepositos,
      primeraRemesa: nDepositos > 0 && sorteoRemesa < 0.35 + q * 0.4,
      primerPagoPresencial: nDepositos > 0 && sorteoPresencial < 0.6,
    });
  }
  return out;
}

export function generarSocios(
  cantidad: number,
  baseRegistro = BASE_REGISTRO,
  baseActivacion = BASE_ACTIVACION,
  factorReferidos = FACTOR_REFERIDOS,
): Socio[] {
  // Dos flujos independientes: así calibrar las tasas del embudo no altera
  // el tamaño de las cuadrillas ni el total de invitaciones.
  const r = mulberry32(20260820);
  const socios: Socio[] = [];

  for (let i = 0; i < cantidad; i++) {
    const [ciudad, estado] = elige(r, CIUDADES);
    const apellido = elige(r, APELLIDOS);
    const oficio = elige(r, OFICIOS);
    const empresa = `${apellido} ${oficio} ${elige(r, SUFIJOS)}`;
    const q = calidad(r);

    // Tamaño de cuadrilla: mayoría pequeña, cola larga de contratistas grandes.
    const nEmpleados = r() < 0.9 ? enteroEntre(r, 3, 14) : enteroEntre(r, 15, 120);

    // No todos los empleados reciben invitación.
    const referidos = Math.max(
      1,
      Math.round(nEmpleados * (0.35 + q * 0.6) * factorReferidos),
    );
    const id = `s${String(i + 1).padStart(4, "0")}`;
    const codigo = `${apellido.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "X")}-${enteroEntre(r, 1000, 9999)}`;

    socios.push({
      id,
      codigo,
      empresa,
      ciudad,
      estado,
      telefono: `(${enteroEntre(r, 200, 989)}) ${enteroEntre(r, 200, 999)}-${String(enteroEntre(r, 0, 9999)).padStart(4, "0")}`,
      email: `contacto@${apellido.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}${oficio.toLowerCase().slice(0, 4).normalize("NFD").replace(/[̀-ͯ]/g, "")}.com`,
      nEmpleados,
      altaFecha: new Date(
        Date.UTC(2026, enteroEntre(r, 0, 7), enteroEntre(r, 1, 28)),
      ).toISOString().slice(0, 10),
      trabajadores: generarTrabajadores(
        mulberry32(0x9e3779b9 ^ (i + 1)),
        id,
        referidos,
        q,
        baseRegistro,
        baseActivacion,
      ),
    });
  }
  return socios;
}

/** El socio demo va primero: es el que se abre en el portal y en el Loom. */
export const SOCIOS: Socio[] = [SOCIO_DEMO, ...generarSocios(999)];

export function metricasDe(s: Socio): MetricasSocio {
  const ts = s.trabajadores;
  const registrados = ts.filter((t) => t.cuentaCreada).length;
  const activos = ts.filter((t) => estadoDe(t) === "activa_con_deposito").length;
  const depositosTotales = ts.reduce((n, t) => n + t.nDepositos, 0);
  const ganadas = ts.reduce((n, t) => n + recompensaGanada(t), 0);
  const potenciales = ts.reduce((n, t) => n + recompensaPendiente(t), 0);
  const tasaRegistro = ts.length ? registrados / ts.length : 0;
  const tasaActivacion = registrados ? activos / registrados : 0;
  const depositosPorActivo = activos ? depositosTotales / activos : 0;

  return {
    socioId: s.id,
    referidosEnviados: ts.length,
    registrados,
    activos,
    pendientes: ts.length - registrados,
    registradosSinDeposito: registrados - activos,
    depositosTotales,
    remesas: ts.filter((t) => t.primeraRemesa).length,
    recompensasGanadas: ganadas,
    recompensasPotenciales: potenciales,
    tasaRegistro,
    tasaActivacion,
    depositosPorActivo,
    /**
     * Valor ≠ volumen. Un socio de 120 empleados con 8% de activación vale
     * menos que uno de 10 con 70%. Pesamos calidad de activación y constancia
     * de depósitos, escalado por volumen real de cuentas activas.
     */
    puntajeValor:
      activos === 0
        ? 0
        : Math.round(
            (tasaActivacion * 45 +
              Math.min(depositosPorActivo / 6, 1) * 35 +
              Math.min(ganadas / (ts.length * TECHO_POR_TRABAJADOR || 1), 1) * 20) *
              Math.min(1 + Math.log10(activos) / 2, 2) *
              10,
          ) / 10,
  };
}

export const METRICAS: Record<string, MetricasSocio> = Object.fromEntries(
  SOCIOS.map((s) => [s.id, metricasDe(s)]),
);

export function socioPorCodigo(codigo: string): Socio | undefined {
  const c = codigo.trim().toUpperCase();
  return SOCIOS.find((s) => s.codigo.toUpperCase() === c);
}

export function socioPorId(id: string): Socio | undefined {
  return SOCIOS.find((s) => s.id === id);
}

export function resumenPrograma() {
  const ms = SOCIOS.map((s) => METRICAS[s.id]);
  const enviados = ms.reduce((n, m) => n + m.referidosEnviados, 0);
  const registrados = ms.reduce((n, m) => n + m.registrados, 0);
  const activos = ms.reduce((n, m) => n + m.activos, 0);
  return {
    socios: SOCIOS.length,
    sociosActivos: ms.filter((m) => m.activos > 0).length,
    enviados,
    registrados,
    activos,
    depositos: ms.reduce((n, m) => n + m.depositosTotales, 0),
    remesas: ms.reduce((n, m) => n + m.remesas, 0),
    pagadas: ms.reduce((n, m) => n + m.recompensasGanadas, 0),
    proyectadas: ms.reduce((n, m) => n + m.recompensasPotenciales, 0),
    convRegistro: enviados ? registrados / enviados : 0,
    convActivacion: registrados ? activos / registrados : 0,
  };
}
