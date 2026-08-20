import { socioPorCodigo } from "@/lib/datos";
import { FormularioReferido } from "@/components/formulario-referido";
import { LogoComun } from "@/components/ui";
import { PREMIO_TITULAR_COMIDA } from "@/lib/recompensas";
import {
  IconoBanco,
  IconoCandado,
  IconoGlobo,
  IconoTarjeta,
} from "@/components/iconos";

const BENEFICIOS = [
  {
    Icono: IconoBanco,
    titulo: "Tu cuenta en EE. UU. en minutos",
    texto: "Sin número de Seguro Social y sin saldo mínimo. Solo tu identificación.",
  },
  {
    Icono: IconoTarjeta,
    titulo: "Tarjeta de débito gratis",
    texto: "Úsala en más de 61 millones de comercios, sin comisiones mensuales.",
  },
  {
    Icono: IconoGlobo,
    titulo: "Manda dinero a tu país fácil",
    texto: "Remesas a toda Latinoamérica desde la app. La primera es gratis.",
  },
  {
    Icono: IconoCandado,
    titulo: "Tus datos 100% privados",
    texto: "Tu información es tuya. Nadie más tiene acceso a ella.",
  },
];

export default async function PaginaReferido({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const decodificado = decodeURIComponent(codigo);
  const socio = socioPorCodigo(decodificado);

  return (
    <main className="mx-auto min-h-dvh max-w-lg bg-crema pb-16">
      <header className="flex items-center justify-center border-b border-gris-borde bg-white px-5 py-4">
        <LogoComun />
      </header>

      {socio ? (
        <div className="bg-lima px-5 py-4 text-center">
          <p className="text-sm text-verde/70">Te invitó</p>
          <p className="text-lg font-extrabold leading-tight text-verde">
            {socio.empresa}
          </p>
        </div>
      ) : (
        <div className="bg-gris px-5 py-3 text-center text-sm text-gris-texto">
          Abre tu cuenta Común. Si tu patrón te dio un código, escríbelo abajo.
        </div>
      )}

      <section className="px-5 pt-9">
        <h1 className="titular text-[2.6rem] sm:text-5xl">
          Tu dinero,
          <br />
          en tus manos.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gris-texto">
          Abre tu cuenta bancaria en Estados Unidos desde tu teléfono. Cobra tu
          pago hasta 2 días antes y manda dinero a tu familia sin filas.
        </p>
      </section>

      <section className="mt-8 space-y-3 px-5">
        {BENEFICIOS.map((b) => (
          <div
            key={b.titulo}
            className="flex gap-4 rounded-tarjeta border border-gris-borde bg-white p-4"
          >
            <b.Icono className="mt-0.5" />
            <div>
              <p className="font-bold text-verde">{b.titulo}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-gris-texto">{b.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-tarjeta bg-lima p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-verde/60">
            Por abrir tu cuenta
          </p>
          <p className="mt-2 text-2xl font-extrabold leading-tight text-verde">
            Tu primera remesa gratis + ${PREMIO_TITULAR_COMIDA} de regalo
          </p>
          <p className="mt-2 text-sm leading-relaxed text-verde/75">
            Te invitamos tu primera comida pagada con Común.
          </p>
        </div>
      </section>

      <section className="mt-10 px-5">
        <h2 className="titular text-2xl">Empieza aquí</h2>
        <p className="mt-1.5 mb-5 text-sm text-gris-texto">
          Toma menos de 2 minutos.
        </p>
        <FormularioReferido
          codigoInicial={socio ? socio.codigo : ""}
          codigoValido={Boolean(socio)}
        />
      </section>
    </main>
  );
}
