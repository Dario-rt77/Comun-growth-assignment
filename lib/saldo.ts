/** Saldo flotante típico: una fracción del pago semanal que aún no se gasta. */
export function saldoFlotante(tarifaHora: number, nDepositos: number): number {
  if (nDepositos === 0) return 0;
  const fraccion = 0.18 + ((nDepositos * 37 + tarifaHora * 13) % 60) / 100;
  return Math.round(tarifaHora * 40 * fraccion);
}
