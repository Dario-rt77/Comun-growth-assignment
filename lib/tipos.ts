export type EstadoReferido =
  | "enviada"
  | "registrado_sin_deposito"
  | "activa_con_deposito";

export type Dia = {
  fecha: string; // ISO corto, ej. "2026-08-17"
  horas: number;
  pagado: boolean;
};

export type Trabajador = {
  id: string;
  socioId: string;
  nombre: string;
  telefono: string;
  cuenta: string | null; // últimos 4 dígitos enmascarados
  tarifaHora: number;
  cuentaCreada: boolean;
  nDepositos: number;
  primeraRemesa: boolean;
  primerPagoPresencial: boolean;
  /** Saldo flotante en la cuenta Común. */
  saldo: number;
  dias?: Dia[];
};

export type Socio = {
  id: string;
  codigo: string;
  empresa: string;
  ciudad: string;
  estado: string;
  telefono: string;
  email: string;
  nEmpleados: number;
  altaFecha: string;
  trabajadores: Trabajador[];
};

export type MetricasSocio = {
  socioId: string;
  referidosEnviados: number;
  registrados: number;
  activos: number;
  pendientes: number;
  registradosSinDeposito: number;
  depositosTotales: number;
  remesas: number;
  recompensasGanadas: number;
  recompensasPotenciales: number;
  tasaRegistro: number;
  tasaActivacion: number;
  depositosPorActivo: number;
  saldoTotal: number;
};
