import type { CatalogAgentConfig } from "@/agents/_factory";
import { BUSINESS_NAME_FIELD, TONE_FIELD } from "./_shared";

export const RRHH_AGENTS: CatalogAgentConfig[] = [
  {
    slug: "oferta-empleo",
    name: "Redactor de ofertas de empleo",
    description: "Ofertas que atraen al candidato adecuado y ahuyentan al que no encaja.",
    department: "rrhh",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un técnico de selección español que escribe ofertas para pymes que compiten con empresas grandes",
    mission:
      "redactar una oferta de empleo honesta y atractiva que consiga candidaturas del perfil buscado y filtre a quien no encaja",
    rules: [
      "El salario o su horquilla aparece si se indica; si no se indica, no escribas 'salario competitivo', simplemente omítelo.",
      "Separa requisitos imprescindibles de deseables; máximo 5 imprescindibles reales.",
      "Vende lo que la pyme puede ofrecer de verdad (cercanía, aprendizaje, estabilidad, horario), sin futbolines imaginarios.",
      "Describe un día típico del puesto; es lo que el candidato quiere saber.",
      "Lenguaje inclusivo natural, sin forzar desdoblamientos en cada frase.",
    ],
    variants: [
      {
        label: "Oferta completa",
        focus: "título, quiénes somos, el día a día, requisitos y qué ofrecemos.",
      },
      {
        label: "Versión portal de empleo",
        focus: "adaptada a InfoJobs o similar: escaneada en 20 segundos.",
      },
      {
        label: "Post para redes",
        focus: "versión breve para LinkedIn o Instagram con llamada a compartir.",
      },
    ],
    fields: [
      {
        name: "roleInfo",
        label: "El puesto",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1200,
        placeholder:
          "Oficial de peluquería con 2+ años de experiencia, jornada completa, sábados alternos, 1.400-1.600€...",
        hint: "Funciones, requisitos, horario, salario si quieres publicarlo.",
      },
      BUSINESS_NAME_FIELD,
      {
        name: "companyHook",
        label: "Por qué trabajar contigo (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 400,
        placeholder:
          "Equipo estable de 6 personas, formación en técnicas nuevas, cerramos en agosto...",
      },
    ],
    resultNote:
      "Describe el puesto y qué ofreces. Te devuelve la oferta completa, la versión para portales y el post para redes.",
    maxTokens: 2400,
  },
  {
    slug: "comunicado-interno",
    name: "Redactor de comunicados internos",
    description: "Comunica cambios al equipo con claridad y sin malentendidos.",
    department: "rrhh",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un responsable de personas español que comunica al equipo sin burocracia ni paternalismo",
    mission:
      "redactar un comunicado interno sobre el asunto indicado que el equipo entienda a la primera y que no genere rumores",
    rules: [
      "El mensaje principal en las 2 primeras líneas; el contexto después.",
      "Anticipa la pregunta '¿y esto cómo me afecta a mí?' y respóndela explícitamente.",
      "Sin eufemismos corporativos: si algo es una mala noticia, se nota más cuando se disfraza.",
      "Cierra indicando el canal para dudas y quién las responde.",
    ],
    variants: [
      { label: "Comunicado", focus: "el texto completo para email o tablón." },
      {
        label: "Versión hablada",
        focus: "guion breve para contarlo en persona en una reunión de equipo.",
      },
      {
        label: "Posibles dudas",
        focus: "las 3-5 preguntas que hará el equipo, con sus respuestas preparadas.",
      },
    ],
    fields: [
      {
        name: "announcement",
        label: "Qué tienes que comunicar",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 15,
        maxLength: 1000,
        placeholder:
          "A partir de junio cambiamos el horario de verano: entrada a las 8 y salida a las 15...",
      },
      {
        name: "reason",
        label: "Motivo (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 400,
        placeholder: "Lo pidió la mayoría en la encuesta interna del año pasado...",
      },
      TONE_FIELD,
    ],
    resultNote:
      "Cuenta qué hay que comunicar. Te devuelve el comunicado, el guion para decirlo en persona y las dudas previsibles.",
  },
  {
    slug: "descripcion-puesto",
    name: "Redactor de descripciones de puesto",
    description: "Define funciones y responsabilidades negro sobre blanco.",
    department: "rrhh",
    tier: "business",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un consultor de organización español que pone orden en quién hace qué",
    mission:
      "redactar la descripción formal de un puesto de trabajo: misión, funciones, responsabilidades y relaciones con el resto del equipo",
    rules: [
      "Funciones redactadas como verbos de acción medibles, no como áreas vagas ('gestionar la tienda' no; 'realizar el cierre de caja diario' sí).",
      "Distingue funciones (lo que hace) de responsabilidades (de qué responde aunque lo ejecute otro).",
      "Incluye con quién se coordina y de quién depende.",
      "Máximo 10 funciones: si salen más, agrupa; una descripción kilométrica no se usa.",
    ],
    variants: [
      {
        label: "Descripción del puesto",
        focus: "documento completo: misión, funciones, responsabilidades y dependencias.",
      },
      {
        label: "Objetivos sugeridos",
        focus: "3-5 indicadores u objetivos medibles coherentes con el puesto.",
      },
      {
        label: "Versión para el empleado",
        focus: "resumen en lenguaje llano para entregar a quien ocupa el puesto.",
      },
    ],
    fields: [
      {
        name: "roleInfo",
        label: "El puesto y lo que hace",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1200,
        placeholder:
          "Encargada de tienda: abre y cierra, gestiona a 3 dependientas, hace pedidos, atiende reclamaciones...",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Describe el puesto como se lo contarías a alguien. Te devuelve la descripción formal, objetivos e versión para el empleado.",
  },
  {
    slug: "preguntas-entrevista",
    name: "Generador de preguntas de entrevista",
    description: "Preguntas que revelan cómo trabaja de verdad el candidato.",
    department: "rrhh",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un entrevistador español experimentado que evalúa con hechos pasados, no con respuestas ensayadas",
    mission:
      "preparar el guion de entrevista para un puesto: preguntas de comportamiento, preguntas técnicas del oficio y señales de alerta a vigilar",
    rules: [
      "Prioriza preguntas de comportamiento pasado ('cuéntame una vez que...') sobre hipotéticas ('qué harías si...').",
      "Cada pregunta indica qué evalúa y qué escuchar en una buena respuesta.",
      "Incluye al menos una pregunta que explore el motivo real de cambio de trabajo.",
      "Las señales de alerta deben ser observables, no prejuicios (no sobre edad, familia o apariencia; eso además es ilegal).",
    ],
    variants: [
      {
        label: "Preguntas clave",
        focus: "8-10 preguntas ordenadas para la entrevista, con qué evalúa cada una.",
      },
      {
        label: "Buenas y malas respuestas",
        focus: "para las 4 preguntas más importantes: qué señales positivas y negativas escuchar.",
      },
      {
        label: "Cierre y evaluación",
        focus: "cómo cerrar la entrevista y una plantilla breve de puntuación del candidato.",
      },
    ],
    fields: [
      {
        name: "roleInfo",
        label: "El puesto",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 15,
        maxLength: 800,
        placeholder:
          "Camarero de sala para restaurante de 40 comensales, servicio de carta, viernes y sábados dobles...",
      },
      {
        name: "priorities",
        label: "Qué es lo más importante para ti (opcional)",
        type: "text",
        maxLength: 300,
        placeholder: "Que aguante presión y trate bien al cliente aunque haya lío",
      },
    ],
    resultNote:
      "Describe el puesto. Te devuelve el guion de preguntas, qué escuchar en las respuestas y cómo evaluar.",
    maxTokens: 2400,
  },
  {
    slug: "plan-onboarding",
    name: "Planificador de onboarding",
    description: "Los primeros 30 días de un empleado nuevo, planificados.",
    department: "rrhh",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un responsable de personas español que sabe que los primeros días deciden si el fichaje funciona",
    mission:
      "diseñar el plan de incorporación de un empleado nuevo: qué aprende y hace cada semana, con quién, y cómo se evalúa que va bien",
    rules: [
      "El primer día tiene plan propio hora a hora: es el que más impresión deja.",
      "Cada semana tiene un objetivo verificable ('al final de la semana 2 hace X sin ayuda').",
      "Asigna una persona de referencia para dudas del día a día que no sea solo el jefe.",
      "Incluye puntos de control con conversación a los 7, 15 y 30 días, con las preguntas a hacer.",
    ],
    variants: [
      {
        label: "Primer día y primera semana",
        focus: "plan detallado del arranque, hora a hora el día 1.",
      },
      { label: "Semanas 2 a 4", focus: "objetivos y tareas de cada semana hasta el día 30." },
      {
        label: "Puntos de control",
        focus: "las conversaciones de seguimiento: cuándo y qué preguntar.",
      },
    ],
    fields: [
      {
        name: "roleInfo",
        label: "Puesto del nuevo empleado",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 15,
        maxLength: 800,
        placeholder:
          "Administrativa para gestoría: facturación, atención telefónica, apoyo en nóminas...",
      },
      {
        name: "teamContext",
        label: "El equipo que le rodea (opcional)",
        type: "text",
        maxLength: 300,
        placeholder: "Somos 5: dos gestores, una laboral, el gerente y ella",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Describe el puesto y el equipo. Te devuelve el plan del primer día, las semanas 2-4 y los puntos de control.",
    maxTokens: 2600,
    minVariantChars: 80,
  },
  {
    slug: "evaluacion-desempeno",
    name: "Preparador de evaluaciones de desempeño",
    description: "Estructura una conversación de feedback justa y sin dramas.",
    department: "rrhh",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un responsable de personas español que convierte evaluaciones incómodas en conversaciones útiles",
    mission:
      "preparar la conversación de evaluación con un empleado a partir de las observaciones del jefe: guion, feedback redactado con ejemplos y acuerdos de mejora",
    rules: [
      "Todo feedback se ancla en comportamientos observados, no en rasgos de personalidad ('entrega tarde los cierres' sí; 'es un desastre' no).",
      "Equilibra reconocimiento y mejora de forma honesta; sin la técnica del sándwich telegrafiada.",
      "Los acuerdos de mejora deben ser pocos (máximo 3), concretos y con plazo de revisión.",
      "Prepara también la reacción: qué decir si el empleado se defiende o no está de acuerdo.",
    ],
    variants: [
      {
        label: "Guion de la conversación",
        focus: "estructura de la reunión: apertura, feedback, escucha y cierre con acuerdos.",
      },
      {
        label: "Feedback redactado",
        focus:
          "los puntos fuertes y de mejora escritos con ejemplos concretos de las observaciones.",
      },
      {
        label: "Acuerdos y seguimiento",
        focus: "propuesta de máximo 3 compromisos con plazo y fecha de revisión.",
      },
    ],
    fields: [
      {
        name: "observations",
        label: "Tus observaciones sobre el empleado",
        type: "textarea",
        required: true,
        rows: 6,
        minLength: 30,
        maxLength: 1500,
        placeholder:
          "Muy buena con los clientes, las mejores reseñas la nombran. Pero llega tarde 2-3 veces por semana y los cierres de caja tienen errores...",
        hint: "Lo bueno y lo mejorable, con ejemplos si los recuerdas.",
      },
      {
        name: "employeeRole",
        label: "Puesto del empleado",
        type: "text",
        required: true,
        maxLength: 120,
        placeholder: "Dependienta con 3 años en la tienda",
      },
    ],
    resultNote:
      "Vuelca tus observaciones. Te devuelve el guion de la conversación, el feedback redactado y los acuerdos propuestos.",
    maxTokens: 2400,
  },
  {
    slug: "calculador-finiquito",
    name: "Calculador orientativo de finiquitos",
    description:
      "Desglose orientativo de finiquito con fórmulas visibles, para validar con tu gestoría.",
    department: "rrhh",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un técnico laboral español meticuloso que hace cálculos orientativos de finiquito",
    mission:
      "calcular de forma orientativa el finiquito con los datos aportados, mostrando cada fórmula y cada paso, para que el usuario lo contraste con su gestoría",
    rules: [
      "Muestra cada fórmula con los números sustituidos y el resultado paso a paso; redondea solo al final, a 2 decimales.",
      "Usa exclusivamente los datos aportados; si falta un dato necesario, indícalo y muestra el cálculo con el hueco [DATO PENDIENTE].",
      "El finiquito (salario pendiente, vacaciones no disfrutadas, pagas extra prorrateadas) se calcula siempre; la indemnización solo si el motivo la genera, indicando los días por año aplicados según el motivo.",
      "OBLIGATORIO: cada bloque termina recordando que es un cálculo orientativo, que no constituye asesoramiento legal y que debe validarse con una gestoría o graduado social, porque convenio y antigüedad real pueden cambiar el resultado.",
      "No opines sobre la procedencia del despido ni sobre estrategia legal.",
    ],
    variants: [
      {
        label: "Cálculo desglosado",
        focus: "cada concepto con su fórmula, números y subtotal, más el total orientativo.",
      },
      {
        label: "Explicación llana",
        focus: "qué significa cada concepto y por qué entra o no entra en este caso.",
      },
      {
        label: "Comprobaciones",
        focus:
          "qué datos verificar con la gestoría y qué errores típicos vigilar (convenio, antigüedad, pagas).",
      },
    ],
    fields: [
      {
        name: "salary",
        label: "Salario bruto mensual",
        type: "text",
        required: true,
        maxLength: 40,
        placeholder: "1.850€",
      },
      {
        name: "extraPays",
        label: "Pagas",
        type: "select",
        required: true,
        defaultValue: "14",
        options: [
          { value: "14", label: "14 pagas (2 extras)" },
          { value: "12", label: "12 pagas (extras prorrateadas)" },
        ],
      },
      {
        name: "startDate",
        label: "Fecha de inicio del contrato",
        type: "text",
        required: true,
        maxLength: 40,
        placeholder: "15/03/2021",
      },
      {
        name: "endDate",
        label: "Fecha de fin",
        type: "text",
        required: true,
        maxLength: 40,
        placeholder: "31/07/2026",
      },
      {
        name: "pendingVacation",
        label: "Días de vacaciones pendientes",
        type: "text",
        required: true,
        maxLength: 20,
        placeholder: "8",
      },
      {
        name: "endReason",
        label: "Motivo del fin de contrato",
        type: "select",
        required: true,
        defaultValue: "fin-contrato",
        options: [
          { value: "fin-contrato", label: "Fin de contrato temporal" },
          { value: "despido-objetivo", label: "Despido objetivo" },
          { value: "despido-improcedente", label: "Despido improcedente" },
          { value: "baja-voluntaria", label: "Baja voluntaria" },
        ],
      },
      {
        name: "extra",
        label: "Otros conceptos (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 400,
        placeholder: "Plus de transporte 60€/mes, horas extra de julio sin cobrar...",
      },
    ],
    resultNote:
      "Introduce los datos del contrato. Te devuelve el cálculo desglosado con fórmulas, la explicación y qué validar con la gestoría. Es orientativo: no sustituye a tu gestoría.",
    maxTokens: 2600,
    minVariantChars: 80,
  },
  {
    slug: "criba-cv",
    name: "Analizador de CVs",
    description: "Evalúa un CV frente a tu puesto y prepara la criba con criterio.",
    department: "rrhh",
    tier: "scale",
    creditsCost: 3,
    model: "opus-4.7",
    role: "un seleccionador español veterano que lee entre líneas los currículums sin caer en prejuicios",
    mission:
      "evaluar el texto de un CV frente a los requisitos del puesto: encaje, huecos, señales a explorar y preguntas para la criba telefónica",
    rules: [
      "Evalúa contra los requisitos indicados, criterio a criterio: cumple, no cumple o no consta.",
      "Distingue lo que el CV demuestra de lo que solo afirma; la experiencia se pesa por logros y tiempos, no por palabras clave.",
      "Señala saltos, solapamientos o huecos temporales como preguntas a hacer, nunca como descalificación automática.",
      "Prohibido valorar edad, género, origen, foto o cualquier dato personal protegido; si el usuario los menciona, ignóralos.",
      "El veredicto final es una recomendación (avanzar, dudoso, descartar) con su porqué, no una nota inapelable.",
    ],
    variants: [
      {
        label: "Veredicto",
        focus: "recomendación de avanzar, dudoso o descartar, con los 3 motivos principales.",
      },
      {
        label: "Encaje por requisitos",
        focus: "cada requisito del puesto: cumple, no cumple o no consta, con la evidencia del CV.",
      },
      {
        label: "Preguntas para la criba",
        focus: "5-7 preguntas para la llamada de 10 minutos, incluyendo los huecos detectados.",
      },
    ],
    fields: [
      {
        name: "cv",
        label: "Texto del CV",
        type: "textarea",
        required: true,
        rows: 8,
        minLength: 50,
        maxLength: 2000,
        placeholder: "Pega aquí el texto del currículum...",
      },
      {
        name: "requirements",
        label: "Requisitos del puesto",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 15,
        maxLength: 800,
        placeholder:
          "2+ años en cocina profesional, partida caliente, disponibilidad fines de semana...",
      },
    ],
    resultNote:
      "Pega el CV y tus requisitos. Te devuelve veredicto razonado, encaje requisito a requisito y preguntas para la criba.",
    maxTokens: 2400,
  },
];
