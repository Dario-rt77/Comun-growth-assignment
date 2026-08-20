"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Boton, Campo } from "./ui";

export function FormularioSocio() {
  const router = useRouter();
  const [v, setV] = useState({
    empresa: "",
    telefono: "",
    email: "",
    empleados: "",
    password: "",
    confirmar: "",
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((prev) => ({ ...prev, [k]: e.target.value }));

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (v.empresa.trim().length < 3) e.empresa = "Escribe el nombre de tu empresa";
    if (v.telefono.replace(/\D/g, "").length < 10) e.telefono = "Necesitamos 10 dígitos";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Revisa tu correo";
    if (!v.empleados || Number(v.empleados) < 1) e.empleados = "¿Cuántas personas trabajan contigo?";
    if (v.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (v.password !== v.confirmar) e.confirmar = "Las contraseñas no coinciden";
    setErrores(e);
    if (Object.keys(e).length === 0) router.push("/socios/verifica");
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Campo etiqueta="Nombre de la empresa" placeholder="Gómez Plomería y Renovaciones LLC" value={v.empresa} onChange={set("empresa")} error={errores.empresa} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Teléfono" placeholder="(713) 555-0142" inputMode="tel" value={v.telefono} onChange={set("telefono")} error={errores.telefono} />
        <Campo etiqueta="Número de empleados" placeholder="14" inputMode="numeric" value={v.empleados} onChange={set("empleados")} error={errores.empleados} />
      </div>
      <Campo etiqueta="Correo electrónico" placeholder="contacto@tuempresa.com" type="email" value={v.email} onChange={set("email")} error={errores.email} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Contraseña" type="password" value={v.password} onChange={set("password")} error={errores.password} />
        <Campo etiqueta="Confirmar contraseña" type="password" value={v.confirmar} onChange={set("confirmar")} error={errores.confirmar} />
      </div>
      <Boton type="submit" className="w-full">Crear mi cuenta de socio</Boton>
      <p className="text-center text-xs text-gris-texto">
        Registrarte es gratis y no tiene costo para tu empresa.
      </p>
    </form>
  );
}
