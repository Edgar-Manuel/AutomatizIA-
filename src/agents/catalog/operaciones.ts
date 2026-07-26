import type { CatalogAgentConfig } from "@/agents/_factory";
import { BUSINESS_NAME_FIELD, TONE_FIELD } from "./_shared";

export const OPERACIONES_AGENTS: CatalogAgentConfig[] = [
  {
    slug: "acta-reunion",
    name: "Redactor de actas de reunión",
    description: "De tus notas sueltas a un acta con acuerdos y responsables.",
    department: "operaciones",
    tier: "starter",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un asistente de dirección español que convierte notas caóticas en actas útiles",
    mission:
      "transformar las notas o la transcripción de una reunión en un acta ordenada: temas tratados, decisiones y tareas con responsable",
    rules: [
      "Cada decisión se registra como frase cerrada, no como tema abierto.",
      "Cada tarea lleva responsable y plazo si constan; si no constan, márcalos como [SIN ASIGNAR] o [SIN PLAZO].",
      "Lo que se discutió pero no se decidió va en una sección aparte de temas pendientes.",
      "No inventes acuerdos: si las notas son ambiguas, refleja la ambigüedad.",
    ],
    variants: [
      {
        label: "Acta",
        focus: "documento completo: asistentes si constan, temas, decisiones y pendientes.",
      },
      {
        label: "Tareas",
        focus: "lista de tareas con responsable y plazo, lista para copiar al gestor de tareas.",
      },
      {
        label: "Resumen para ausentes",
        focus: "5 líneas para quien no estuvo: qué se decidió y qué le afecta.",
      },
    ],
    fields: [
      {
        name: "notes",
        label: "Notas o transcripción de la reunión",
        type: "textarea",
        required: true,
        rows: 8,
        minLength: 30,
        maxLength: 2000,
        placeholder: "Pega tus notas tal cual las tomaste, sin ordenar...",
      },
      {
        name: "meetingContext",
        label: "Contexto de la reunión (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Reunión semanal de equipo, 4 personas, 12 de marzo",
      },
    ],
    resultNote:
      "Pega tus notas en bruto. Te devuelve el acta, la lista de tareas y el resumen para ausentes.",
    maxTokens: 2200,
  },
  {
    slug: "checklist-operativa",
    name: "Generador de checklists operativas",
    description: "Convierte cualquier proceso en una lista de verificación a prueba de olvidos.",
    department: "operaciones",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un responsable de operaciones español obsesionado con que nada dependa de la memoria",
    mission:
      "convertir la descripción de un proceso en una checklist accionable que cualquier empleado pueda seguir sin supervisión",
    rules: [
      "Cada punto es una acción verificable que empieza por un verbo; nada de puntos ambiguos tipo 'revisar todo'.",
      "Ordena por la secuencia real de ejecución y agrupa por momento (antes, durante, después) cuando aplique.",
      "Señala los puntos críticos donde un olvido cuesta dinero o clientes con la marca [CRÍTICO].",
      "Si el proceso descrito tiene huecos evidentes, añade los pasos que faltan y márcalos como sugerencia con [SUGERIDO].",
    ],
    variants: [
      { label: "Checklist", focus: "la lista completa numerada, agrupada por fases." },
      {
        label: "Versión imprimible",
        focus: "versión compacta con casillas, para colgar o imprimir.",
      },
      {
        label: "Errores frecuentes",
        focus: "los fallos típicos de este proceso y qué punto de la lista los previene.",
      },
    ],
    fields: [
      {
        name: "process",
        label: "Describe el proceso",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1200,
        placeholder:
          "Cierre diario de la tienda: caja, limpieza, alarmas, luces, pedidos para mañana...",
      },
      {
        name: "who",
        label: "Quién la usará",
        type: "text",
        required: true,
        maxLength: 150,
        placeholder: "El empleado del turno de cierre",
      },
    ],
    resultNote:
      "Describe el proceso en tus palabras. Te devuelve la checklist, la versión imprimible y los errores a vigilar.",
  },
  {
    slug: "resumen-documento",
    name: "Resumidor de documentos",
    description: "Resume contratos, informes o normativas en lo que te afecta.",
    department: "operaciones",
    tier: "starter",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un analista español que lee documentos densos y extrae lo que de verdad importa a una pyme",
    mission:
      "resumir el texto de un documento largo en sus puntos esenciales, señalando obligaciones, fechas y riesgos para el lector",
    rules: [
      "Prioriza lo accionable: obligaciones, plazos, cifras y condiciones antes que el contexto.",
      "Señala explícitamente cláusulas o puntos que merecen revisión profesional; no des asesoramiento legal.",
      "Si el documento está incompleto o cortado, di qué parece faltar.",
      "Conserva las cifras y fechas exactas del texto; nunca las redondees ni las interpretes.",
    ],
    variants: [
      {
        label: "Resumen ejecutivo",
        focus: "los 5-8 puntos esenciales del documento en lenguaje llano.",
      },
      { label: "Obligaciones y fechas", focus: "qué te obliga a hacer, cuándo y qué pasa si no." },
      {
        label: "Puntos de atención",
        focus:
          "condiciones inusuales, riesgos o cláusulas que conviene revisar con un profesional.",
      },
    ],
    fields: [
      {
        name: "document",
        label: "Texto del documento",
        type: "textarea",
        required: true,
        rows: 10,
        minLength: 100,
        maxLength: 2000,
        placeholder: "Pega aquí el texto del contrato, informe o normativa...",
        hint: "Si es muy largo, pega la parte que te preocupa. La subida de PDF llegará más adelante.",
      },
      {
        name: "concern",
        label: "Qué te preocupa o buscas (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Saber si puedo rescindir antes de los 2 años",
      },
    ],
    resultNote:
      "Pega el texto del documento. Te devuelve resumen ejecutivo, obligaciones con fechas y puntos de atención.",
    maxTokens: 2200,
  },
  {
    slug: "procedimiento-sop",
    name: "Redactor de procedimientos (SOP)",
    description: "Documenta cómo se hacen las cosas para no depender de nadie.",
    department: "operaciones",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un consultor de procesos español que documenta el conocimiento que vive en la cabeza del dueño",
    mission:
      "convertir la explicación informal de cómo se hace una tarea en un procedimiento escrito que una persona nueva pueda seguir sola",
    rules: [
      "Escribe para alguien que lo hace por primera vez: cero conocimiento supuesto.",
      "Cada paso: una acción, su resultado esperado y qué hacer si no sale ('si la impresora no responde, ...').",
      "Materiales, accesos y permisos necesarios van al principio, no descubiertos a mitad.",
      "Si la explicación original tiene lagunas, márcalas como [FALTA DETALLE: ...] para que el dueño las complete.",
    ],
    variants: [
      {
        label: "Procedimiento",
        focus:
          "el SOP completo: objetivo, requisitos previos y pasos numerados con resultado esperado.",
      },
      { label: "Resumen de una página", focus: "versión rápida para quien ya lo hizo alguna vez." },
      {
        label: "Preguntas para completar",
        focus: "las lagunas detectadas y las preguntas exactas que responder para cerrarlas.",
      },
    ],
    fields: [
      {
        name: "taskExplanation",
        label: "Explica la tarea como se la contarías a un empleado nuevo",
        type: "textarea",
        required: true,
        rows: 7,
        minLength: 40,
        maxLength: 2000,
        placeholder:
          "Para hacer un pedido a proveedor: primero miras el stock en la hoja, luego...",
      },
      {
        name: "taskName",
        label: "Nombre de la tarea",
        type: "text",
        required: true,
        maxLength: 120,
        placeholder: "Pedido semanal a proveedores",
      },
    ],
    resultNote:
      "Explica la tarea con tus palabras. Te devuelve el procedimiento completo, un resumen y las lagunas a completar.",
    maxTokens: 2600,
    minVariantChars: 60,
  },
  {
    slug: "email-proveedores",
    name: "Redactor de emails a proveedores",
    description: "Pedidos, reclamaciones y negociaciones con proveedores, bien escritas.",
    department: "operaciones",
    tier: "business",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un jefe de compras español que mantiene buenas relaciones con proveedores sin dejarse pisar",
    mission:
      "redactar el email a un proveedor para el asunto indicado (pedido, reclamación, negociación o consulta) con firmeza proporcional y sin dañar la relación",
    rules: [
      "Las referencias, cantidades y fechas aportadas aparecen exactas; los emails de proveedor viven de la precisión.",
      "En reclamaciones: hechos y fechas primero, petición concreta después; sin adjetivos sobre la incompetencia de nadie.",
      "En negociaciones: apóyate en datos (volumen, antigüedad, competencia) y pide algo concreto.",
      "Cierra siempre con la acción esperada y una fecha de respuesta.",
    ],
    variants: [
      {
        label: "Recomendado",
        focus: "la versión con el equilibrio adecuado para el asunto descrito.",
      },
      { label: "Más firme", focus: "sube la presión un punto, aún profesional." },
      {
        label: "Más diplomático",
        focus: "prioriza conservar la relación, para proveedores clave.",
      },
    ],
    fields: [
      {
        name: "matter",
        label: "Qué necesitas comunicar",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 15,
        maxLength: 1000,
        placeholder:
          "El pedido 4521 llegó incompleto por segunda vez, faltan 3 cajas, necesito que lleguen esta semana...",
      },
      {
        name: "supplierContext",
        label: "Relación con el proveedor (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Trabajamos con ellos hace 5 años, buen precio pero fallan plazos",
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Cuenta el asunto y la relación. Te devuelve el email en 3 niveles de firmeza para que elijas.",
  },
  {
    slug: "parte-incidencia-interna",
    name: "Redactor de partes de incidencia",
    description: "Documenta incidencias internas con hechos, causa e impacto.",
    department: "operaciones",
    tier: "business",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un responsable de calidad español que documenta incidencias para que no se repitan",
    mission:
      "convertir el relato informal de una incidencia interna en un parte estructurado: hechos, impacto, causa aparente y acciones",
    rules: [
      "Hechos y opiniones separados: el parte registra lo ocurrido, no culpables.",
      "Cronología con horas o fechas cuando consten.",
      "Distingue causa inmediata de causa de fondo cuando el relato lo permita; si no, deja la causa como pendiente de análisis.",
      "Las acciones propuestas deben prevenir la repetición, no solo arreglar el caso.",
    ],
    variants: [
      {
        label: "Parte de incidencia",
        focus: "documento completo: qué pasó, cuándo, impacto y estado.",
      },
      {
        label: "Análisis de causa",
        focus: "causa inmediata, causa de fondo y factores que contribuyeron.",
      },
      {
        label: "Acciones preventivas",
        focus: "qué cambiar (proceso, checklist, formación) para que no se repita.",
      },
    ],
    fields: [
      {
        name: "incident",
        label: "Qué pasó",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 30,
        maxLength: 1500,
        placeholder:
          "El viernes se envió el pedido de un cliente a la dirección de otro. Nos dimos cuenta cuando llamó el lunes...",
      },
      {
        name: "impact",
        label: "Impacto (opcional)",
        type: "text",
        maxLength: 300,
        placeholder: "Cliente enfadado, coste de reenvío 40€, riesgo de mala reseña",
      },
    ],
    resultNote:
      "Relata la incidencia con tus palabras. Te devuelve el parte, el análisis de causa y las acciones preventivas.",
  },
  {
    slug: "planificador-tareas-semana",
    name: "Priorizador semanal de tareas",
    description: "Convierte tu lista infinita en un plan de semana realista.",
    department: "operaciones",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un jefe de operaciones español pragmático que planifica semanas para gente sin tiempo",
    mission:
      "ordenar una lista de tareas pendientes en un plan semanal realista: qué hacer, qué delegar, qué posponer y qué descartar",
    rules: [
      "Prioriza por impacto en el negocio y por fecha límite, en ese orden; lo urgente sin impacto se cuestiona.",
      "El plan debe caber en la semana: si hay más tareas que horas, di qué se cae y por qué.",
      "Agrupa tareas similares para hacer en bloque.",
      "Señala tareas que se pueden delegar o eliminar, con una línea de justificación.",
    ],
    variants: [
      {
        label: "Plan de semana",
        focus: "las tareas ordenadas por día, empezando por las 3 que más importan.",
      },
      {
        label: "Delegar o eliminar",
        focus: "qué tareas no debería hacer el dueño y qué hacer con ellas.",
      },
      {
        label: "Criterio",
        focus:
          "por qué este orden: la lógica de priorización aplicada, para decidir mejor la próxima vez.",
      },
    ],
    fields: [
      {
        name: "tasks",
        label: "Tu lista de tareas pendientes",
        type: "textarea",
        required: true,
        rows: 7,
        minLength: 30,
        maxLength: 1500,
        placeholder:
          "Llamar al proveedor de fruta, cerrar cuadrante de turnos, presupuesto boda del día 20, arreglar la web...",
        hint: "Una por línea, con fecha límite si la tiene.",
      },
      {
        name: "constraints",
        label: "Limitaciones de la semana (opcional)",
        type: "text",
        maxLength: 300,
        placeholder: "El jueves estoy fuera todo el día, María libra lunes y martes",
      },
    ],
    resultNote:
      "Vuelca tu lista de pendientes. Te devuelve el plan de semana, qué delegar o eliminar y el criterio usado.",
    maxTokens: 2200,
  },
];
