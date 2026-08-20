import type { Dia, Socio, Trabajador } from "./tipos";

export const CODIGO_DEMO = "GPR-4471";

/** Semana de trabajo completa: lunes 2026-08-10 a domingo 2026-08-16. */
function semana(horas: number[], pagados: boolean[]): Dia[] {
  const base = ["10", "11", "12", "13", "14", "15", "16"];
  return base.map((d, i) => ({
    fecha: `2026-08-${d}`,
    horas: horas[i] ?? 0,
    pagado: pagados[i] ?? false,
  }));
}

type Semilla = {
  nombre: string;
  telefono: string;
  cuenta: string | null;
  tarifaHora: number;
  cuentaCreada: boolean;
  nDepositos: number;
  primeraRemesa: boolean;
  primerPagoPresencial: boolean;
  horas: number[];
  pagados: boolean[];
};

/**
 * Cuadrilla escrita a mano — es el único conjunto de datos que el revisor
 * va a leer de verdad, así que cubre todos los estados del embudo y todos
 * los escalones de recompensa en vez de salir del generador aleatorio.
 */
const CUADRILLA: Semilla[] = [
  // Cuentas activas y maduras — techo de $40 alcanzado
  { nombre: "José Ramírez Ochoa", telefono: "(713) 445-2201", cuenta: "•••• 8842", tarifaHora: 28, cuentaCreada: true, nDepositos: 9, primeraRemesa: true, primerPagoPresencial: true, horas: [8, 8, 9, 8, 8, 5, 0], pagados: [true, true, true, true, false, false, false] },
  { nombre: "Miguel Ángel Torres", telefono: "(713) 902-7714", cuenta: "•••• 1096", tarifaHora: 30, cuentaCreada: true, nDepositos: 7, primeraRemesa: true, primerPagoPresencial: true, horas: [8, 8, 8, 8, 8, 0, 0], pagados: [true, true, true, false, false, false, false] },
  { nombre: "Luis Fernando Peña", telefono: "(281) 336-4408", cuenta: "•••• 5523", tarifaHora: 26, cuentaCreada: true, nDepositos: 6, primeraRemesa: true, primerPagoPresencial: false, horas: [8, 9, 8, 8, 6, 4, 5], pagados: [true, true, false, false, false, false, false] },
  // Activos con 4+ depósitos, falta la remesa
  { nombre: "Carlos Mendoza Rivas", telefono: "(832) 774-1250", cuenta: "•••• 3317", tarifaHora: 32, cuentaCreada: true, nDepositos: 5, primeraRemesa: false, primerPagoPresencial: true, horas: [8, 8, 8, 8, 8, 6, 0], pagados: [true, true, true, true, true, false, false] },
  { nombre: "Pedro Antonio Guzmán", telefono: "(713) 118-6642", cuenta: "•••• 7781", tarifaHora: 24, cuentaCreada: true, nDepositos: 4, primeraRemesa: false, primerPagoPresencial: true, horas: [7, 8, 8, 7, 8, 0, 0], pagados: [true, true, false, false, false, false, false] },
  // Activos recientes — solo el primer depósito
  { nombre: "Andrés Felipe Salazar", telefono: "(346) 220-9903", cuenta: "•••• 2264", tarifaHora: 27, cuentaCreada: true, nDepositos: 2, primeraRemesa: true, primerPagoPresencial: false, horas: [8, 8, 8, 6, 8, 0, 6], pagados: [true, false, false, false, false, false, false] },
  { nombre: "Rubén Darío Escobar", telefono: "(281) 559-3387", cuenta: "•••• 9018", tarifaHora: 25, cuentaCreada: true, nDepositos: 1, primeraRemesa: false, primerPagoPresencial: false, horas: [8, 8, 7, 8, 8, 4, 0], pagados: [false, false, false, false, false, false, false] },
  // Cuenta creada pero sin depósito todavía — el cuello de botella del socio
  { nombre: "Héctor Iván Cabrera", telefono: "(713) 664-8829", cuenta: "•••• 4402", tarifaHora: 29, cuentaCreada: true, nDepositos: 0, primeraRemesa: false, primerPagoPresencial: false, horas: [8, 8, 8, 8, 8, 5, 4], pagados: [true, true, false, false, false, false, false] },
  { nombre: "Javier Alonso Fuentes", telefono: "(832) 907-1156", cuenta: "•••• 6630", tarifaHora: 23, cuentaCreada: true, nDepositos: 0, primeraRemesa: false, primerPagoPresencial: false, horas: [6, 8, 8, 4, 0, 0, 0], pagados: [false, false, false, false, false, false, false] },
  // Invitación enviada, sin registrarse
  { nombre: "Óscar Eduardo Rojas", telefono: "(346) 771-2048", cuenta: null, tarifaHora: 22, cuentaCreada: false, nDepositos: 0, primeraRemesa: false, primerPagoPresencial: false, horas: [8, 8, 8, 8, 8, 0, 0], pagados: [true, true, true, false, false, false, false] },
  { nombre: "Manuel de Jesús Ibarra", telefono: "(713) 305-7792", cuenta: null, tarifaHora: 21, cuentaCreada: false, nDepositos: 0, primeraRemesa: false, primerPagoPresencial: false, horas: [8, 7, 8, 8, 6, 5, 0], pagados: [false, false, false, false, false, false, false] },
  { nombre: "Rafael Santiago Bautista", telefono: "(281) 442-6613", cuenta: null, tarifaHora: 26, cuentaCreada: false, nDepositos: 0, primeraRemesa: false, primerPagoPresencial: false, horas: [8, 8, 0, 8, 8, 8, 6], pagados: [true, false, false, false, false, false, false] },
];

const trabajadores: Trabajador[] = CUADRILLA.map((s, i) => ({
  id: `demo-t${i + 1}`,
  socioId: "demo",
  nombre: s.nombre,
  telefono: s.telefono,
  cuenta: s.cuenta,
  tarifaHora: s.tarifaHora,
  cuentaCreada: s.cuentaCreada,
  nDepositos: s.nDepositos,
  primeraRemesa: s.primeraRemesa,
  primerPagoPresencial: s.primerPagoPresencial,
  dias: semana(s.horas, s.pagados),
}));

export const SOCIO_DEMO: Socio = {
  id: "demo",
  codigo: CODIGO_DEMO,
  empresa: "Gómez Plomería y Renovaciones LLC",
  ciudad: "Houston",
  estado: "TX",
  telefono: "(713) 555-0142",
  email: "contacto@gomezplomeria.com",
  nEmpleados: 14,
  altaFecha: "2026-03-04",
  trabajadores,
};
