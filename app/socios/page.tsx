import Link from "next/link";
import { FormularioSocio } from "@/components/formulario-socio";
import { BotonLink, LogoComun, Tarjeta } from "@/components/ui";
import {
  PREMIO_CUARTO_DEPOSITO,
  PREMIO_PRIMER_DEPOSITO,
  PREMIO_PRIMERA_REMESA,
  TECHO_POR_TRABAJADOR,
  formatoUSD,
} from "@/lib/recompensas";

const ESCALONES = [
  {
    monto: PREMIO_PRIMER_DEPOSITO,
    titulo: "Primer depósito directo",
    texto: "Cuando le haces su primer pago a la cuenta Común de tu trabajador.",
  },
  {
    monto: PREMIO_CUARTO_DEPOSITO,
    titulo: "Cuarto depósito directo",
    texto: "Cuando ese trabajador ya cobra contigo de forma constante.",
  },
  {
    monto: PREMIO_PRIMERA_REMESA,
    titulo: "Primera remesa internacional",
    texto: "Cuando manda dinero a su país desde su cuenta Común.",
  },
];

export default function PaginaSocios() {
  return (
    <main className="min-h-dvh bg-crema">
      <header className="flex items-center justify-between border-b border-gris-borde bg-white px-6 py-4">
        <Link href="/"><LogoComun /></Link>
        <BotonLink href="/socios/panel" variante="contorno" className="px-5 py-2 text-sm">
          Iniciar sesión
        </BotonLink>
      </header>

      <section className="bg-lima px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-verde/60">
            Programa de Socios
          </p>
          <h1 className="titular mt-3 max-w-2xl text-4xl sm:text-5xl">
            Tu cuadrilla cobra mejor. Tú ganas hasta {formatoUSD(TECHO_POR_TRABAJADOR)} por trabajador.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-verde/80">
            Ayuda a tu gente a abrir una cuenta bancaria en Estados Unidos —
            sin Seguro Social — y recibe una recompensa por cada uno que empiece
            a cobrar contigo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="titular text-3xl">Cómo ganas</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {ESCALONES.map((e, i) => (
            <Tarjeta key={e.titulo}>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-verde">
                  {i === 0 ? "" : "+"}{formatoUSD(e.monto)}
                </span>
              </div>
              <p className="mt-3 font-bold text-verde">{e.titulo}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gris-texto">{e.texto}</p>
            </Tarjeta>
          ))}
        </div>
        <p className="mt-6 rounded-tarjeta bg-menta px-5 py-4 text-sm leading-relaxed text-verde">
          <strong>Y tu trabajador también gana:</strong> su primera remesa es
          gratis y le damos $10 cuando hace su primera compra con la tarjeta
          Común. Le llamamos «te invitamos tu primera comida».
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-20">
        <Tarjeta className="p-7 sm:p-9">
          <h2 className="titular text-3xl">Crea tu cuenta</h2>
          <p className="mt-2 mb-7 text-gris-texto">
            Te damos tu código de socio para que empieces a invitar a tu equipo.
          </p>
          <FormularioSocio />
        </Tarjeta>
      </section>
    </main>
  );
}
