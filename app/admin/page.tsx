import { METRICAS, SOCIOS, resumenPrograma, serieMensual } from "@/lib/datos";
import { formatoUSD } from "@/lib/recompensas";
import { LogoComun, Stat, Tarjeta } from "@/components/ui";
import { TablaSocios, type Fila } from "@/components/tabla-socios";

export default function Admin() {
  const r = resumenPrograma();
  const meses = serieMensual();

  const filas: Fila[] = SOCIOS.map((s) => {
    const m = METRICAS[s.id];
    return {
      id: s.id,
      empresa: s.empresa,
      ciudad: s.ciudad,
      estado: s.estado,
      codigo: s.codigo,
      enviados: m.referidosEnviados,
      registrados: m.registrados,
      activos: m.activos,
      depositos: m.depositosTotales,
      ganadas: m.recompensasGanadas,
      tasaActivacion: m.tasaActivacion,
      saldoTotal: m.saldoTotal,
    };
  });

  const porBalance = [...filas].sort((a, b) => b.saldoTotal - a.saldoTotal).slice(0, 5);
  const porCuentas = [...filas].sort((a, b) => b.activos - a.activos).slice(0, 5);

  const num = (n: number) => n.toLocaleString("es-MX");
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <main className="min-h-dvh bg-crema pb-20">
      <header className="flex items-center justify-between border-b border-gris-borde bg-white px-6 py-4">
        <a href="https://www.comun.app"><LogoComun /></a>
        <span className="rounded-full bg-verde px-4 py-1.5 text-sm font-semibold text-white">
          Equipo Común · interno
        </span>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <h1 className="titular text-3xl sm:text-4xl">Programa de socios constructores</h1>
        <p className="mt-2 text-gris-texto">
          Desempeño global del canal de subcontratistas de construcción.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat valor={num(r.socios)} etiqueta="Socios registrados" />
          <Stat valor={num(r.enviados)} etiqueta="Invitaciones enviadas" />
          <Stat valor={num(r.registrados)} etiqueta="Cuentas creadas" />
          <Stat valor={num(r.activos)} etiqueta="Cuentas activas con depósito" tono="exito" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Tarjeta>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gris-texto">
              Conversion funnel
            </h2>
            <div className="mt-5 space-y-4">
              {[
                ["Invitación → cuenta creada", r.convRegistro, r.registrados],
                ["Cuenta creada → depósito", r.convActivacion, r.activos],
              ].map(([t, v, n]) => (
                <div key={t as string}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gris-texto">{t as string}</span>
                    <span className="font-extrabold text-verde">{pct(v as number)}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gris">
                    <div
                      className="h-full rounded-full bg-verde"
                      style={{ width: `${(v as number) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gris-texto">{num(n as number)} cuentas</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-gris-borde pt-4">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gris-texto">Socios con cuentas creadas</span>
                <span className="font-extrabold text-verde">{num(r.sociosConRegistro)}</span>
              </div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gris-texto">Socios con cuentas activas</span>
                <span className="font-extrabold text-verde">{num(r.sociosActivos)}</span>
              </div>
            </div>
          </Tarjeta>

          <Tarjeta>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gris-texto">
              Recompensas
            </h2>
            <p className="mt-5 text-3xl font-extrabold text-verde">{formatoUSD(r.pagadas)}</p>
            <p className="mt-1 text-sm text-gris-texto">pagadas a socios hasta hoy</p>
            <p className="mt-4 text-xl font-bold text-verde">{formatoUSD(r.proyectadas)}</p>
            <p className="mt-1 text-sm text-gris-texto">
              comprometidas si la base actual completa sus hitos
            </p>
            <p className="mt-4 rounded-2xl bg-ambar px-4 py-3 text-xs leading-relaxed text-verde">
              Costo por cuenta activa: <strong>{formatoUSD(r.activos ? r.pagadas / r.activos : 0)}</strong>{" "}
              en recompensa al socio.
            </p>
          </Tarjeta>

          <Tarjeta>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gris-texto">
              Últimos 3 meses
            </h2>
            <div className="mt-4 space-y-4">
              {meses.map((mes) => (
                <div key={mes.mes} className="border-b border-gris-borde pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-extrabold text-verde">{mes.mes}</p>
                  <dl className="mt-1.5 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gris-texto">Cuentas activas</dt>
                      <dd className="font-semibold tabular-nums text-verde">{num(mes.activas)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gris-texto">Balance flotante promedio</dt>
                      <dd className="font-semibold tabular-nums text-verde">{formatoUSD(mes.saldoPromedio)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gris-texto">Remesas</dt>
                      <dd className="font-semibold tabular-nums text-verde">{num(mes.remesas)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </Tarjeta>
        </div>

        <section className="mt-12">
          <h2 className="titular text-2xl">¿Quién genera más valor?</h2>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-gris-texto">
            Dos lecturas complementarias: cuánto dinero mantienen los trabajadores
            de cada socio en sus cuentas Común, y cuántas cuentas activas trajo
            cada socio al programa.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {[
              ["Balance total en cuentas de trabajadores", porBalance, true],
              ["Número de cuentas activas", porCuentas, false],
            ].map(([titulo, lista, esBalance]) => (
              <Tarjeta key={titulo as string}>
                <h3 className="font-extrabold text-verde">{titulo as string}</h3>
                <ol className="mt-4 space-y-3">
                  {(lista as Fila[]).map((f, i) => (
                    <li key={f.id} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gris text-xs font-bold text-gris-texto">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-verde">{f.empresa}</p>
                        <p className="text-xs text-gris-texto">
                          {f.activos} cuentas activas de {f.enviados} invitaciones
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold tabular-nums ${
                          esBalance ? "bg-lima text-verde" : "bg-menta text-[#0d6b43]"
                        }`}
                      >
                        {esBalance ? formatoUSD(f.saldoTotal) : f.activos}
                      </span>
                    </li>
                  ))}
                </ol>
              </Tarjeta>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="titular text-2xl">Todos los socios</h2>
          <p className="mt-1.5 mb-5 text-sm text-gris-texto">
            Busca y ordena por cualquier columna.
          </p>
          <TablaSocios filas={filas} />
        </section>
      </div>
    </main>
  );
}
