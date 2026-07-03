import type { CatalogAgentConfig } from "@/agents/_factory";
import { BUSINESS_NAME_FIELD, TONE_FIELD } from "./_shared";

export const FINANZAS_AGENTS: CatalogAgentConfig[] = [
  {
    slug: "reclamacion-impagos",
    name: "Reclamador de facturas impagadas",
    description: "Secuencia de reclamación que cobra sin quemar al cliente.",
    department: "finanzas",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un responsable de administración español curtido en cobrar facturas sin perder clientes",
    mission:
      "redactar la secuencia de reclamación de una factura impagada en tres niveles de firmeza crecientes, del recordatorio amable al aviso previo a otras vías",
    rules: [
      "Los datos de la factura (número, importe, vencimiento) aparecen exactos en cada mensaje.",
      "El primer nivel presume buena fe: un despiste. El tono se endurece por niveles, nunca de golpe.",
      "Cada mensaje pide una acción concreta: pagar antes de una fecha o proponer un plan de pago.",
      "En el último nivel menciona los pasos siguientes (reclamación formal, intereses de demora si constan en las condiciones) sin amenazas vacías ni asesoría legal.",
      "Incluye la línea 'Asunto: ...' al principio de cada mensaje.",
    ],
    variants: [
      {
        label: "Recordatorio amable",
        focus:
          "primer aviso presumiendo despiste, con los datos de la factura y facilidades para pagar.",
      },
      {
        label: "Reclamación firme",
        focus: "segundo aviso: constata el impago previo, fija fecha límite y ofrece hablar.",
      },
      {
        label: "Último aviso",
        focus: "tercer mensaje: fecha final y consecuencias concretas si no hay respuesta.",
      },
    ],
    fields: [
      {
        name: "invoiceData",
        label: "Datos de la factura",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 15,
        maxLength: 600,
        placeholder:
          "Factura 2026-041, 1.240€, vencía el 15 de mayo, servicios de mantenimiento de abril...",
      },
      {
        name: "clientContext",
        label: "Relación con el cliente (opcional)",
        type: "text",
        maxLength: 300,
        placeholder: "Cliente desde hace 4 años, siempre pagó bien, es la primera vez",
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Pon los datos de la factura. Te devuelve los 3 niveles de reclamación para enviar espaciados en el tiempo.",
  },
  {
    slug: "conciliador-gastos",
    name: "Conciliador de tickets de gastos",
    description: "Pega tus tickets y gastos y recíbelos categorizados y cuadrados.",
    department: "finanzas",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un administrativo contable español ordenado que clasifica gastos para la gestoría",
    mission:
      "organizar una lista desordenada de tickets y gastos: categorizarlos, sumar por categoría y señalar duplicados, huecos o gastos dudosos",
    rules: [
      "Respeta los importes tal cual: nada de corregir cifras; si un importe parece erróneo o ilegible, márcalo como dudoso.",
      "Usa categorías contables habituales de pyme española (suministros, dietas, transporte, material de oficina, publicidad, etc.).",
      "Los totales por categoría deben cuadrar con la suma de sus líneas; muestra el total general.",
      "Señala posibles duplicados (mismo importe y fecha), gastos sin fecha y gastos posiblemente no deducibles, como avisos para revisar con la gestoría.",
    ],
    variants: [
      {
        label: "Gastos categorizados",
        focus: "cada gasto con su categoría asignada, en lista ordenada por categoría.",
      },
      { label: "Totales", focus: "suma por categoría y total general del periodo." },
      {
        label: "Avisos",
        focus: "duplicados, importes dudosos, datos que faltan y gastos a revisar con la gestoría.",
      },
    ],
    fields: [
      {
        name: "expenses",
        label: "Lista de gastos o tickets",
        type: "textarea",
        required: true,
        rows: 8,
        minLength: 30,
        maxLength: 2000,
        placeholder:
          "12/05 gasolinera Repsol 68,40\n13/05 comida con cliente 45,20\n13/05 Amazon tóner 89,99...",
        hint: "Uno por línea: fecha, concepto e importe. La lectura de fotos de tickets llegará más adelante.",
      },
      {
        name: "period",
        label: "Periodo (opcional)",
        type: "text",
        maxLength: 60,
        placeholder: "Mayo 2026",
      },
    ],
    resultNote:
      "Pega tu lista de gastos. Te devuelve los gastos categorizados, los totales y los avisos a revisar.",
    maxTokens: 2400,
  },
  {
    slug: "resumen-financiero",
    name: "Explicador de resultados",
    description: "Tus números del mes explicados en cristiano, con señales de alerta.",
    department: "finanzas",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un director financiero externo español que explica números a dueños de negocio sin formación contable",
    mission:
      "interpretar las cifras aportadas del negocio y explicar en lenguaje llano qué van diciendo: qué va bien, qué preocupa y qué mirar de cerca",
    rules: [
      "Trabaja solo con las cifras aportadas; si falta un dato para una conclusión, dilo en lugar de suponerlo.",
      "Traduce cada observación a su consecuencia práctica ('el margen bajó 4 puntos: de cada 100€ vendidos te quedan 4€ menos').",
      "Distingue hechos (las cifras) de hipótesis (posibles causas); las causas propón verificarlas.",
      "Esto no es asesoramiento fiscal ni contable formal: las decisiones importantes, con su asesor. Dilo cuando toque.",
    ],
    variants: [
      {
        label: "Lectura general",
        focus: "qué dicen las cifras del estado del negocio, en lenguaje llano.",
      },
      { label: "Señales de alerta", focus: "los 2-4 datos que más deben preocupar y por qué." },
      {
        label: "Qué vigilar",
        focus: "qué indicadores seguir el mes que viene y qué preguntas llevar al asesor.",
      },
    ],
    fields: [
      {
        name: "figures",
        label: "Tus cifras",
        type: "textarea",
        required: true,
        rows: 6,
        minLength: 30,
        maxLength: 1500,
        placeholder:
          "Ventas mayo: 28.400€ (abril 31.200€). Compras: 12.100€. Nóminas: 9.800€. Alquiler: 2.200€. Banco: 6.300€...",
        hint: "Ventas, gastos principales, saldo... lo que tengas, del periodo que sea.",
      },
      {
        name: "businessContext",
        label: "Contexto del negocio (opcional)",
        type: "text",
        maxLength: 300,
        placeholder: "Restaurante, mayo suele ser mes flojo, en junio empieza terraza",
      },
    ],
    resultNote:
      "Pega tus cifras del periodo. Te devuelve la lectura en lenguaje llano, las alertas y qué vigilar.",
    maxTokens: 2200,
  },
  {
    slug: "presupuesto-cliente",
    name: "Redactor de presupuestos",
    description: "Presupuestos con partidas claras y condiciones que evitan disgustos.",
    department: "finanzas",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un profesional español autónomo con años de oficio presupuestando trabajos sin letra pequeña",
    mission:
      "convertir la descripción de un trabajo en un presupuesto formal: partidas desglosadas, condiciones de pago y exclusiones que eviten malentendidos",
    rules: [
      "Usa los precios indicados tal cual; donde falte precio, deja [PRECIO] sin inventar cifras.",
      "Cada partida en su línea, con lo que incluye; los trabajos 'todo incluido' acaban en discusión.",
      "Las exclusiones explícitas (qué NO incluye) son obligatorias: es la sección que evita disgustos.",
      "Incluye validez de la oferta, forma de pago y qué ocurre con modificaciones sobre lo presupuestado.",
      "Indica si los importes son con o sin IVA según se aporte; si no consta, márcalo como pendiente de confirmar.",
    ],
    variants: [
      {
        label: "Presupuesto",
        focus: "documento completo: partidas, importes, condiciones y exclusiones.",
      },
      {
        label: "Email de envío",
        focus: "el mensaje breve con el que mandar el presupuesto al cliente.",
      },
      {
        label: "Aclaraciones previsibles",
        focus: "las 3-4 preguntas que hará el cliente y sus respuestas preparadas.",
      },
    ],
    fields: [
      {
        name: "jobDescription",
        label: "El trabajo y sus precios",
        type: "textarea",
        required: true,
        rows: 6,
        minLength: 25,
        maxLength: 1500,
        placeholder:
          "Pintar piso de 90m2: paredes y techos, quitar gotelé del salón (12m2 a 18€/m2), pintura plástica blanca incluida, 5 días...",
        hint: "Qué harás, con qué precios y plazos. Lo que no pongas saldrá como [PRECIO].",
      },
      BUSINESS_NAME_FIELD,
      {
        name: "clientName",
        label: "Cliente (opcional)",
        type: "text",
        maxLength: 120,
        placeholder: "Comunidad de propietarios Calle Mayor 4",
      },
      TONE_FIELD,
    ],
    resultNote:
      "Describe el trabajo y los precios. Te devuelve el presupuesto formal, el email de envío y las aclaraciones.",
    maxTokens: 2600,
    minVariantChars: 60,
  },
  {
    slug: "email-banco-gestoria",
    name: "Comunicador con banco y gestoría",
    description: "Solicitudes formales bien planteadas para que respondan a la primera.",
    department: "finanzas",
    tier: "business",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un administrador de pyme español que escribe a bancos y gestorías con la precisión que exigen",
    mission:
      "redactar la comunicación formal a un banco, gestoría u organismo para el trámite indicado, con todos los datos necesarios para evitar el ping-pong de emails",
    rules: [
      "Identifica en la primera línea quién escribe y qué pide; los buzones formales trían por asunto y primera frase.",
      "Incluye todos los datos de referencia aportados (cuentas, expedientes, fechas, CIF); lo que falte, márcalo como [COMPLETAR].",
      "Una petición por email; si el usuario mezcla varios trámites, sepáralos en mensajes distintos dentro de la misma variante.",
      "Cierra con plazo de respuesta esperado y disponibilidad para aportar documentación.",
    ],
    variants: [
      {
        label: "Email formal",
        focus: "el mensaje completo con asunto, datos de referencia y petición clara.",
      },
      { label: "Versión breve", focus: "para gestorías de confianza: lo mismo sin protocolo." },
      {
        label: "Documentación probable",
        focus: "qué documentos suelen pedir para este trámite, para adelantarse.",
      },
    ],
    fields: [
      {
        name: "request",
        label: "Qué necesitas pedir o tramitar",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 15,
        maxLength: 1000,
        placeholder:
          "Pedir al banco la novación de la hipoteca del local para ampliar plazo de 10 a 15 años...",
      },
      {
        name: "references",
        label: "Datos de referencia (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 400,
        placeholder: "Préstamo n.º 0049-XXXX, titular Panadería Sol SL, CIF B-12345678...",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Explica el trámite. Te devuelve el email formal, la versión breve y la documentación que te pedirán.",
  },
  {
    slug: "politica-gastos",
    name: "Redactor de políticas de gastos",
    description: "Reglas de gastos claras para que el equipo no tenga que preguntar.",
    department: "finanzas",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un director financiero español pragmático que escribe normas de gasto que la gente entiende y cumple",
    mission:
      "redactar la política de gastos de la empresa a partir de las reglas indicadas: qué se puede gastar, con qué límites, cómo se justifica y cómo se reembolsa",
    rules: [
      "Cada regla con su límite en euros y su ejemplo ('comida en desplazamiento: hasta 15€, ticket obligatorio').",
      "Cubre el circuito completo: autorización previa si aplica, justificante, plazo de presentación y plazo de reembolso.",
      "Prevé los casos frontera habituales (invitar a un cliente, gasto sin ticket, kilometraje) con regla explícita; si el usuario no los definió, propón una regla marcada como [PROPUESTA].",
      "Tono de norma de convivencia, no de sospecha: la política protege también al empleado.",
    ],
    variants: [
      {
        label: "Política completa",
        focus: "el documento con categorías, límites, justificación y circuito de reembolso.",
      },
      {
        label: "Resumen para el equipo",
        focus: "una página con lo esencial que cualquiera recuerda.",
      },
      {
        label: "Casos frontera",
        focus:
          "los casos dudosos habituales resueltos con su regla, incluidas las propuestas marcadas.",
      },
    ],
    fields: [
      {
        name: "rules",
        label: "Tus reglas actuales o deseadas",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1200,
        placeholder:
          "Dietas máximo 15€ comida, hotel máximo 80€, kilometraje a 0,26€, todo con ticket, se paga con la nómina siguiente...",
      },
      {
        name: "companyContext",
        label: "Contexto de la empresa (opcional)",
        type: "text",
        maxLength: 300,
        placeholder: "Instaladora de 14 empleados, 6 técnicos en furgoneta todo el día",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Cuenta tus reglas de gasto. Te devuelve la política completa, el resumen para el equipo y los casos frontera.",
    maxTokens: 2600,
    minVariantChars: 80,
  },
  {
    slug: "analisis-flujo-caja",
    name: "Analista de flujo de caja",
    description: "Proyecta tu caja de las próximas semanas y avisa de los baches.",
    department: "finanzas",
    tier: "scale",
    creditsCost: 4,
    model: "opus-4.7",
    role: "un director financiero externo español especializado en tesorería de pymes que viven al mes",
    mission:
      "proyectar la caja de las próximas semanas con los cobros y pagos previstos aportados, detectar los momentos de tensión y proponer cómo cubrirlos",
    rules: [
      "Construye la proyección semana a semana: saldo inicial, cobros, pagos y saldo final, con las cifras aportadas.",
      "Cuando el saldo proyectado se acerque a cero o sea negativo, márcalo como bache con su fecha y su importe.",
      "Las propuestas para cubrir baches se ordenan de menor a mayor coste (adelantar cobros, aplazar pagos negociando, financiación); nada de recomendar productos financieros concretos.",
      "Cobros inciertos se tratan como inciertos: muestra el escenario si ese cobro se retrasa.",
      "Recuerda que es una proyección orientativa con los datos aportados, no asesoramiento financiero.",
    ],
    variants: [
      {
        label: "Proyección semanal",
        focus: "la caja semana a semana: saldo inicial, movimientos y saldo final.",
      },
      {
        label: "Baches y riesgos",
        focus: "dónde y cuándo se tensa la caja, y qué cobros inciertos lo agravan.",
      },
      {
        label: "Plan de acción",
        focus: "medidas concretas ordenadas por coste para pasar los baches detectados.",
      },
    ],
    fields: [
      {
        name: "currentBalance",
        label: "Saldo actual de caja y bancos",
        type: "text",
        required: true,
        maxLength: 40,
        placeholder: "8.400€",
      },
      {
        name: "inflows",
        label: "Cobros previstos",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 15,
        maxLength: 1000,
        placeholder:
          "Cliente A 3.200€ el día 10 (seguro), cliente B 5.400€ hacia el 20 (suele retrasarse)...",
        hint: "Importe, fecha prevista y si es seguro o incierto.",
      },
      {
        name: "outflows",
        label: "Pagos previstos",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 15,
        maxLength: 1000,
        placeholder:
          "Nóminas 6.100€ el 30, alquiler 1.400€ el 5, seguros sociales 1.900€ el 31, proveedor 2.300€ el 15...",
      },
    ],
    resultNote:
      "Pon tu saldo y los cobros y pagos previstos. Te devuelve la proyección semanal, los baches y el plan para cubrirlos.",
    maxTokens: 2800,
    minVariantChars: 80,
  },
];
