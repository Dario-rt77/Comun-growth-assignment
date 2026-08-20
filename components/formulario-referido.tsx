"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Boton, Campo } from "./ui";

export function FormularioReferido({
  codigoInicial,
  codigoValido,
}: {
  codigoInicial: string;
  codigoValido: boolean;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [codigo, setCodigo] = useState(codigoInicial);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  function validar() {
    const e: Record<string, string> = {};
    if (nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo";
    const digitos = telefono.replace(/\D/g, "");
    if (digitos.length < 10) e.telefono = "Necesitamos 10 dígitos";
    if (!codigo.trim()) e.codigo = "Escribe el código de tu patrón";
    return e;
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    setEnviando(true);
    const destino = codigo.trim().toUpperCase() || "SIN-CODIGO";
    router.push(`/r/${encodeURIComponent(destino)}/listo?nombre=${encodeURIComponent(nombre.trim())}`);
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Campo
        etiqueta="Nombre completo"
        placeholder="José Ramírez"
        autoComplete="name"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={errores.nombre}
      />
      <Campo
        etiqueta="Número de teléfono"
        placeholder="(713) 555-0142"
        inputMode="tel"
        autoComplete="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        error={errores.telefono}
      />
      <Campo
        etiqueta="Código de socio"
        placeholder="Ej. GPR-4471"
        value={codigo}
        readOnly={codigoValido}
        disabled={codigoValido}
        onChange={(e) => setCodigo(e.target.value)}
        error={errores.codigo}
        ayuda={
          codigoValido
            ? "Lo llenamos con el código de quien te invitó."
            : "Pídeselo a tu patrón para que él también reciba su recompensa."
        }
      />

      <Boton type="submit" disabled={enviando} className="w-full">
        {enviando ? "Enviando…" : "Abrir mi cuenta"}
      </Boton>

      <p className="text-center text-xs leading-relaxed text-gris-texto">
        Al continuar aceptas que Común te contacte por mensaje de texto.
        No necesitas número de Seguro Social.
      </p>
    </form>
  );
}
