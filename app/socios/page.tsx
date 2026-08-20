import Image from "next/image";
import { FormularioSocio } from "@/components/formulario-socio";
import { BotonLink, LogoComun, Tarjeta } from "@/components/ui";
import {
  PREMIO_CUARTO_DEPOSITO,
  PREMIO_PRIMER_DEPOSITO,
  PREMIO_PRIMERA_REMESA,
  formatoUSD,
} from "@/lib/recompensas";

const PASOS = [
  "Creas tu cuenta constructor en esta misma página.",
  "Refieres a tus trabajadores y ellos reciben un mensaje de texto para abrir su cuenta bancaria con Común.",
  "Ellos descargan la App, abren la cuenta en minutos y tú les envías sus pagos.",
];

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
        <a href="https://www.comun.app"><LogoComun /></a>
        <BotonLink href="/socios/panel" variante="contorno" className="px-5 py-2 text-sm">
          Iniciar sesión
        </BotonLink>
      </header>

      <section className="bg-lima px-6 py-14">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-verde/60">
              Programa para socios constructores
            </p>
            <h1 className="titular mt-3 text-4xl sm:text-5xl">
              Tu cuadrilla cobra más fácil. Tú administras tus pagos mejor y ganas
              hasta $40 USD por trabajador.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-verde/80">
              Ayuda a tus trabajadores a abrir una cuenta bancaria en Estados
              Unidos, sin necesidad de Seguro Social, y facilita tus operaciones en
              el día a día. Deja el efectivo en el pasado.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white">
            <Image
              src="/Partner.png"
              alt="Subcontratista de construcción con casco y chaleco reflectante"
              width={1402}
              height={1122}
              priority
              sizes="(min-width: 1024px) 460px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="titular text-3xl">Cómo funciona</h2>

        <ol className="mt-7 space-y-4">
          {PASOS.map((paso, i) => (
            <li
              key={paso}
              className="text-base leading-relaxed text-verde sm:text-lg"
              style={{ paddingLeft: `${2.5 + i * 1.75}rem` }}
            >
              <span className="font-extrabold">{i + 1}.</span> {paso}
            </li>
          ))}
        </ol>

        <p className="mt-12 rounded-tarjeta bg-lima px-5 py-4 text-center text-lg font-extrabold text-verde">
          ¡Y listo, empiezas a ganar y ellos consiguen su cuenta bancaria!
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
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
          <strong>Y tu trabajador también gana:</strong> abre su cuenta
          bancaria, su primera remesa es gratis y le damos $10 cuando hace su
          primera compra con la tarjeta Común.
        </p>
        <p className="mx-auto mt-14 max-w-3xl text-center text-lg font-extrabold leading-relaxed text-verde-claro">
          ¡Lleva el control de las horas y lo que le has pagado a tus
          trabajadores directamente en la plataforma!
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
