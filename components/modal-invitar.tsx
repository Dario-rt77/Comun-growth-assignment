"use client";

import { useEffect, useState } from "react";
import { Boton, Campo } from "./ui";

export function ModalInvitar({
  empresa,
  onCerrar,
}: {
  empresa: string;
  onCerrar: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCerrar]);

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (nombre.trim().length < 3) e.nombre = "Escribe el nombre de tu trabajador";
    if (telefono.replace(/\D/g, "").length < 10) e.telefono = "Necesitamos 10 dígitos";
    setErrores(e);
    if (Object.keys(e).length === 0) setEnviado(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-verde/40 p-0 sm:items-center sm:p-6"
      onClick={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-t-3xl bg-crema sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gris-borde bg-white px-6 py-5">
          <h2 className="text-lg font-extrabold leading-tight text-verde">
            {enviado ? "Invitación enviada" : "Invitar a cuenta Común"}
          </h2>
          <button
            onClick={onCerrar}
            aria-label="Cerrar"
            className="shrink-0 rounded-full bg-gris px-3 py-1.5 text-lg leading-none text-gris-texto hover:bg-gris-borde"
          >
            ✕
          </button>
        </div>

        {enviado ? (
          <div className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lima text-3xl">
              ✓
            </div>
            <p className="mt-5 text-lg font-extrabold text-verde">
              Le mandamos un mensaje a {nombre.split(" ")[0]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gris-texto">
              Al {telefono} le llegó un texto de parte de {empresa} con el enlace
              para abrir su cuenta Común en minutos.
            </p>
            <Boton onClick={onCerrar} className="mt-6 w-full">
              Listo
            </Boton>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate className="space-y-4 p-6">
            <p className="text-sm leading-relaxed text-gris-texto">
              Le mandamos un mensaje de texto con tu código para que abra su
              cuenta. Tú empiezas a ganar cuando reciba su primer pago tuyo.
            </p>
            <Campo
              etiqueta="Nombre del trabajador"
              placeholder="José Ramírez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={errores.nombre}
            />
            <Campo
              etiqueta="Número de teléfono"
              placeholder="(713) 555-0142"
              inputMode="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              error={errores.telefono}
            />
            <Boton type="submit" className="w-full">
              Enviar invitación
            </Boton>
          </form>
        )}
      </div>
    </div>
  );
}
