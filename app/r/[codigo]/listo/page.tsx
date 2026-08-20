import { socioPorCodigo } from "@/lib/datos";
import { BotonLink, LogoComun } from "@/components/ui";

export default async function ListoPagina({
  params,
  searchParams,
}: {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ nombre?: string }>;
}) {
  const { codigo } = await params;
  const { nombre } = await searchParams;
  const socio = socioPorCodigo(decodeURIComponent(codigo));
  const primerNombre = nombre?.split(" ")[0];

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col bg-crema">
      <header className="flex items-center justify-center border-b border-gris-borde bg-white px-5 py-4">
        <LogoComun />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lima text-4xl">
          ✓
        </div>

        <h1 className="titular mt-7 text-4xl">
          {primerNombre ? `¡Listo, ${primerNombre}!` : "¡Listo!"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gris-texto">
          Recibimos tus datos. Te mandamos un mensaje de texto para terminar de
          abrir tu cuenta.
        </p>

        {socio && (
          <p className="mt-5 rounded-full bg-menta px-4 py-2 text-sm font-medium text-verde">
            Referido por {socio.empresa}
          </p>
        )}

        <div className="mt-10 w-full rounded-tarjeta bg-lima p-6">
          <p className="text-xl font-extrabold leading-tight text-verde">
            Descarga la app y abre tu cuenta en minutos
          </p>
          <BotonLink href="#" className="mt-5 w-full">
            Descargar la app
          </BotonLink>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-gris-texto">
          Tu primera remesa es gratis y te damos $10 cuando hagas tu primera
          compra con tu tarjeta Común.
        </p>
      </div>
    </main>
  );
}
