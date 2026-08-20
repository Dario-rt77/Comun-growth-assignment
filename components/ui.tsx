import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { EstadoReferido } from "@/lib/tipos";

type Variante = "solido" | "contorno" | "lima";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-bold transition disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTES: Record<Variante, string> = {
  solido: "bg-verde text-white hover:bg-verde-claro",
  contorno: "border-2 border-verde text-verde hover:bg-verde hover:text-white",
  lima: "bg-lima text-verde hover:brightness-95",
};

export function Boton({
  variante = "solido",
  className = "",
  ...props
}: ComponentProps<"button"> & { variante?: Variante }) {
  return <button className={`${BASE} ${VARIANTES[variante]} ${className}`} {...props} />;
}

export function BotonLink({
  variante = "solido",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={`${BASE} ${VARIANTES[variante]} ${className}`} {...props} />;
}

export function Tarjeta({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-tarjeta border border-gris-borde bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Campo({
  etiqueta,
  error,
  ayuda,
  className = "",
  ...props
}: ComponentProps<"input"> & {
  etiqueta: string;
  error?: string;
  ayuda?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-verde">{etiqueta}</span>
      <input
        className={`w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-base text-verde outline-none transition placeholder:text-gris-texto/60 focus:border-verde disabled:bg-gris disabled:text-gris-texto ${
          error ? "border-red-400" : "border-gris-borde"
        } ${className}`}
        {...props}
      />
      {ayuda && !error && <span className="mt-1 block text-xs text-gris-texto">{ayuda}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

const ESTILO_ESTADO: Record<EstadoReferido, string> = {
  enviada: "bg-gris text-gris-texto",
  registrado_sin_deposito: "bg-ambar text-[#8a6a12]",
  activa_con_deposito: "bg-menta text-[#0d6b43]",
};

export function Insignia({
  estado,
  texto,
}: {
  estado: EstadoReferido;
  texto: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${ESTILO_ESTADO[estado]}`}
    >
      {estado === "activa_con_deposito" && <span aria-hidden>✓</span>}
      {texto}
    </span>
  );
}

export function BarraProgreso({
  valor,
  max,
  className = "",
}: {
  valor: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, (valor / max) * 100) : 0;
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gris ${className}`}>
      <div
        className="h-full rounded-full bg-verde transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Stat({
  valor,
  etiqueta,
  tono = "normal",
}: {
  valor: string | number;
  etiqueta: string;
  tono?: "normal" | "lima" | "exito";
}) {
  const fondo =
    tono === "lima" ? "bg-lima" : tono === "exito" ? "bg-menta" : "bg-white border border-gris-borde";
  return (
    <div className={`rounded-tarjeta px-5 py-4 ${fondo}`}>
      <div className="text-2xl font-extrabold text-verde sm:text-3xl">{valor}</div>
      <div className="mt-0.5 text-sm leading-tight text-verde/70">{etiqueta}</div>
    </div>
  );
}

export function LogoComun({ className = "" }: { className?: string }) {
  return (
    <span className={`text-2xl font-extrabold tracking-tight text-verde ${className}`}>
      común
    </span>
  );
}
