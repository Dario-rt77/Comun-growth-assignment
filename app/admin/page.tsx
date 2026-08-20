import Link from "next/link";
import { METRICAS, SOCIOS, resumenPrograma } from "@/lib/datos";
import { formatoUSD } from "@/lib/recompensas";
import { LogoComun, Stat, Tarjeta } from "@/components/ui";
import { TablaSocios, type Fila } from "@/components/tabla-socios";

export default function Admin() {
  const r = resumenPrograma();

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
      puntajeValor: m.puntajeValor,
    };
  });

  const porValor = [...filas].sort((a, b) => b.puntajeValor - a.puntajeValor).slice(0, 5);
  const porVolumen = [...filas].sort((a, b) => b.enviados - a.enviados).slice(0, 5);

  const num = (n: number) => n.toLocaleString("es-MX");
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <main className="min-h-dvh bg-crema pb-20">
      <header className="flex items-center justify-between border-b border-gris-borde bg-white px-6 py-4">
        <Link href="/"><LogoComun /></Link>
        <span className="rounded-full bg-verde px-4 py-1.5 text-sm font-semibold text-white">
          Equipo Común · interno
        </span>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <h1 className="titular text-3xl sm:text-4xl">Programa de Socios</h1>
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
              Embudo de conversión
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
              Actividad en cuenta
            </h2>
            <p className="mt-5 text-3xl font-extrabold text-verde">{num(r.depositos)}</p>
            <p className="mt-1 text-sm text-gris-texto">depósitos directos recibidos</p>
            <p className="mt-4 text-xl font-bold text-verde">{num(r.remesas)}</p>
            <p className="mt-1 text-sm text-gris-texto">cuentas con remesa internacional</p>
            <p className="mt-4 text-xs leading-relaxed text-gris-texto">
              {num(r.sociosActivos)} de {num(r.socios)} socios ({pct(r.sociosActivos / r.socios)})
              han activado al menos una cuenta.
            </p>
          </Tarjeta>
        </div>

        <section className="mt-12">
          <h2 className="titular text-2xl">Quién genera más valor</h2>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-gris-texto">
            El puntaje de valor pondera <strong>calidad de activación</strong> y{" "}
            <strong>constancia de depósitos</strong>, no volumen de invitaciones. Por eso el ranking
            por valor no coincide con el ranking por volumen — y es el primero el que deberíamos
            usar para decidir dónde invertir el equipo comercial.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {[
              ["Top 5 por valor", porValor, true],
              ["Top 5 por volumen de invitaciones", porVolumen, false],
            ].map(([titulo, lista, esValor]) => (
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
                          {f.activos} activas de {f.enviados} · {Math.round(f.tasaActivacion * 100)}% activación
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold tabular-nums ${
                          esValor ? "bg-lima text-verde" : "bg-gris text-gris-texto"
                        }`}
                      >
                        {esValor ? f.puntajeValor.toFixed(1) : f.enviados}
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
