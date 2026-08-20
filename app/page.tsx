import Link from "next/link";
import { resumenPrograma } from "@/lib/datos";
import { CODIGO_DEMO } from "@/lib/demo-socio";

const PUERTAS = [
  {
    href: `/r/${CODIGO_DEMO}`,
    etiqueta: "Trabajador",
    titulo: "Página de referido",
    texto:
      "Lo que ve el trabajador al abrir el enlace que le mandó su patrón. Diseñada para móvil.",
  },
  {
    href: "/socios",
    etiqueta: "Socio",
    titulo: "Portal del subcontratista",
    texto:
      "Registro al programa, panel de referidos, recompensas y control de horas de la cuadrilla.",
  },
  {
    href: "/admin",
    etiqueta: "Común",
    titulo: "Panel del programa",
    texto:
      "Vista interna: desempeño global, socios activos y quién genera más valor.",
  },
];

export default function Inicio() {
  const r = resumenPrograma();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold tracking-widest text-gris-texto uppercase">
        Prototipo · Programa de Socios
      </p>
      <h1 className="titular mt-4 text-5xl sm:text-6xl">
        Común para
        <br />
        subcontratistas
      </h1>
      <p className="mt-5 max-w-xl text-lg text-gris-texto">
        Un programa para que los subcontratistas de construcción abran las puertas
        del sistema financiero a su cuadrilla — y ganen por hacerlo.
      </p>

      <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 rounded-tarjeta bg-lima px-7 py-5">
        {[
          [r.socios.toLocaleString("es-MX"), "socios"],
          [r.enviados.toLocaleString("es-MX"), "invitaciones"],
          [r.activos.toLocaleString("es-MX"), "cuentas activas"],
        ].map(([v, l]) => (
          <div key={l}>
            <div className="text-2xl font-extrabold text-verde">{v}</div>
            <div className="text-sm text-verde/70">{l}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {PUERTAS.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group rounded-tarjeta border border-gris-borde bg-white p-6 transition hover:border-verde hover:shadow-lg"
          >
            <span className="inline-block rounded-full bg-gris px-3 py-1 text-xs font-semibold text-gris-texto">
              {p.etiqueta}
            </span>
            <h2 className="mt-4 text-xl font-extrabold text-verde">{p.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gris-texto">{p.texto}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-verde group-hover:underline">
              Abrir →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
