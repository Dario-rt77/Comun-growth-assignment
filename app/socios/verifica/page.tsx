import Link from "next/link";
import { BotonLink, LogoComun } from "@/components/ui";

export default function Verifica() {
  return (
    <main className="min-h-dvh bg-crema">
      <header className="flex items-center justify-center border-b border-gris-borde bg-white px-6 py-4">
        <Link href="/"><LogoComun /></Link>
      </header>

      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lima text-3xl">
          ✉︎
        </div>
        <h1 className="titular mt-7 text-4xl">Recibimos tu información</h1>
        <p className="mt-4 text-lg leading-relaxed text-gris-texto">
          Te mandamos un correo para que termines de crear tu cuenta de socio.
          Revisa tu bandeja de entrada — y también la carpeta de spam.
        </p>

        <div className="mt-10 rounded-tarjeta border border-gris-borde bg-white p-6">
          <p className="text-sm text-gris-texto">
            ¿Ya terminaste de verificar tu correo?
          </p>
          <BotonLink href="/socios/panel" className="mt-4 w-full">
            Iniciar sesión
          </BotonLink>
        </div>

        <p className="mt-6 text-xs text-gris-texto">
          Demo: «Iniciar sesión» te lleva directo al panel de Gómez Plomería y
          Renovaciones LLC.
        </p>
      </div>
    </main>
  );
}
