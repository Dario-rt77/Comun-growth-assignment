# Común · Plataforma del Programa de Socios

Prototipo funcional de un programa de referidos entre **Común** y los
**subcontratistas de construcción** de Estados Unidos.

**Demo en vivo:** https://comun-socios.vercel.app

---

## El problema

Hay unos **700,000 subcontratistas** en EE. UU. que emplean cerca de **2.8 millones de
trabajadores de construcción**, muchos de ellos pagados de manera informal. Una parte
importante de esa población no tiene cuenta bancaria: la banca tradicional les pide
documentos que no tienen.

El subcontratista es el mejor canal posible para llegar a ellos:

1. **Ya tienen la relación de confianza.** El trabajador le cree a su patrón antes que a un anuncio.
2. **Concentran demanda.** Un solo socio trae entre 8 y 40 cuentas potenciales.
3. **Controlan el depósito directo**, que es justo el momento en que una cuenta pasa de
   abierta a *activa*. Ningún otro canal de adquisición controla esa palanca.

## Las tres interfaces

| Ruta | Para quién | Qué hace |
|---|---|---|
| `/r/[codigo]` | **Trabajador** | Página de referido, mobile-first. Muestra quién lo invitó, la propuesta de valor y el formulario de registro. |
| `/socios` | **Socio** | Información del programa y registro. → `/socios/verifica` → `/socios/panel` |
| `/socios/panel` | **Socio** | Panel con su código, embudo de referidos, recompensas y control de horas de la cuadrilla. |
| `/admin` | **Equipo Común** | Desempeño global del programa, ranking de socios y tabla de los 1,000 socios. |

Empieza en `/` — es un índice con las tres puertas.

## El programa de recompensas

**Para el socio**, hasta **$40 por trabajador**:

| Hito | Recompensa |
|---|---|
| Primer depósito directo a la cuenta Común | $10 |
| Cuarto depósito directo | +$20 |
| Primera remesa internacional | +$10 |

**Para el titular de la cuenta:** primera remesa gratis y **$10** tras su primera compra
presencial con la tarjeta («te invitamos tu primera comida»).

El diseño del programa premia **activación real, no registros**. Un socio no gana nada por
invitar; gana cuando el trabajador efectivamente cobra a través de Común. Eso alinea el
incentivo del socio con la métrica que le importa a Común.

---

## Supuestos

Todo lo que sigue es supuesto, no dato real de Común.

**Mercado**
- 700K subcontratistas / 2.8M trabajadores en EE. UU. (≈4 trabajadores por empresa en promedio
  nacional; en el prototipo modelamos ~8 porque el programa apunta a cuadrillas, no a
  contratistas individuales).
- Segmento alcanzable inicial: mercados con alta densidad latina — TX, CA, FL, AZ, GA, NC, IL, NV.

**Embudo** (calibrado en los datos de prueba)
- Invitación → cuenta creada: **~49%**
- Cuenta creada → primer depósito: **~59%**
- Distribución de calidad deliberadamente sesgada: la mayoría de los socios activa poco y
  unos pocos concentran el valor. Un embudo uniforme haría ver el programa mejor de lo que
  sería en la realidad.

**Economía unitaria**
- Costo máximo por cuenta totalmente activada: **$40** (socio) + **$10** (titular) = **$50**.
- El costo real observado en los datos de prueba es menor (**~$29 por cuenta activa**), porque
  no todas las cuentas llegan a todos los hitos. Ese es el punto: el programa solo paga
  completo cuando entrega valor completo.
- El pago está estructurado como **CAC diferido**: nada se paga por adelantado y todo se paga
  contra comportamiento verificable en la cuenta.

**Producto**
- El socio quiere una razón para entrar que no sea solo la recompensa. Por eso el panel incluye
  un **control de horas y pagos de la cuadrilla**: registra tarifa, horas por día y qué días
  están pagados, y calcula lo que le debe a cada trabajador. Esa es la funcionalidad que hace
  que el socio vuelva cada semana — la recompensa sola no sostiene el hábito.

---

## Decisiones de producto que vale la pena señalar

**El puntaje de valor en `/admin` no es volumen.** Pondera calidad de activación y constancia
de depósitos, escalado por cuentas activas reales. Por eso el «Top 5 por valor» y el «Top 5 por
volumen» muestran empresas distintas: un socio de 120 empleados con 8% de activación vale menos
para Común que uno de 10 empleados con 70%. Si el equipo comercial prioriza por volumen, invierte
en el socio equivocado.

**El cuello de botella tiene nombre.** El panel del socio no solo muestra métricas: señala
explícitamente cuántos trabajadores ya abrieron su cuenta pero siguen sin recibir un depósito, y
cuánto dinero representa eso para el socio. Ese es el único paso del embudo que el socio controla
directamente.

**La página del trabajador nunca depende del código.** Si alguien llega sin enlace de referido o
con un código inválido, el formulario sigue funcionando y el campo queda editable.

---

## Limitaciones del prototipo

- **Sin base de datos.** Los 1,000 socios y ~8,655 trabajadores se generan de forma determinista
  con una semilla fija (`lib/datos.ts`), así que los números son idénticos en cada carga.
- **Sin autenticación real.** «Iniciar sesión» entra directo al panel de Gómez Plomería y
  Renovaciones LLC.
- **Las ediciones no persisten.** Cambiar horas o marcar días como pagados funciona en la sesión,
  pero se reinicia al recargar.
- La cuadrilla de Gómez (`lib/demo-socio.ts`) está escrita a mano para cubrir todos los estados
  del embudo y todos los escalones de recompensa.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · desplegado en Vercel.

La lógica de recompensas vive en un solo lugar (`lib/recompensas.ts`) y las tres interfaces la
consumen, así que los números cuadran entre el panel del socio y el panel de Común.

```bash
npm install
npm run dev
```
