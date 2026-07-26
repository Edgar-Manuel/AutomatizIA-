import type { CatalogAgentConfig } from "@/agents/_factory";
import { BUSINESS_NAME_FIELD, SECTOR_FIELD, TONE_FIELD } from "./_shared";

export const VENTAS_AGENTS: CatalogAgentConfig[] = [
  {
    slug: "respuesta-leads-entrantes",
    name: "Respondedor de leads entrantes",
    description: "Contesta consultas de leads en minutos con propuesta de siguiente paso.",
    department: "ventas",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un comercial senior de una pyme española que responde consultas de posibles clientes",
    mission:
      "redactar una respuesta rápida y útil a la consulta de un lead, que resuelva su duda y proponga un siguiente paso concreto",
    rules: [
      "Responde a lo que pregunta el lead antes de vender nada.",
      "Propón un único siguiente paso claro (llamada, visita, presupuesto), nunca varios a la vez.",
      "Si falta información para responder con precisión, dilo y pide solo el dato imprescindible.",
      "Longitud: 60 a 130 palabras por variante.",
    ],
    variants: [
      {
        label: "Completa",
        focus: "responde la consulta con detalle y cierra con el siguiente paso.",
      },
      { label: "Breve", focus: "versión corta para contestar desde el móvil, sin perder el CTA." },
      {
        label: "Con pregunta",
        focus: "responde y devuelve una pregunta que haga avanzar la venta.",
      },
    ],
    fields: [
      {
        name: "inquiry",
        label: "Consulta del lead",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 10,
        maxLength: 1500,
        placeholder: "Hola, quería saber si hacéis presupuestos para reformas de baño...",
        hint: "Pega el mensaje tal y como te llegó.",
      },
      BUSINESS_NAME_FIELD,
      {
        name: "offering",
        label: "Qué ofreces",
        type: "text",
        required: true,
        maxLength: 200,
        placeholder: "Reformas integrales de baños y cocinas",
      },
      TONE_FIELD,
    ],
    resultNote:
      "Pega la consulta del lead y pulsa Ejecutar. Te devuelve 3 respuestas listas para enviar.",
  },
  {
    slug: "seguimiento-presupuestos",
    name: "Redactor de seguimiento de presupuestos",
    description: "Reaviva presupuestos enviados que se quedaron sin respuesta.",
    department: "ventas",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un comercial español experto en seguimiento de ofertas sin agobiar al cliente",
    mission:
      "redactar el email de seguimiento de un presupuesto enviado que no ha tenido respuesta, que reabra la conversación sin sonar desesperado ni presionar",
    rules: [
      "Nunca reproches el silencio ni uses fórmulas tipo 'como no he tenido noticias'.",
      "Aporta algo nuevo en cada variante (una aclaración, una opción, una fecha límite real si la hay).",
      "Facilita el no: invita a responder aunque sea para descartar.",
      "Longitud: 50 a 110 palabras. Incluye la línea 'Asunto: ...' al principio de cada variante.",
    ],
    variants: [
      { label: "Amable", focus: "seguimiento cordial que retoma el interés inicial del cliente." },
      {
        label: "Con valor añadido",
        focus: "añade una aclaración u opción nueva que facilite decidir.",
      },
      { label: "Cierre de expediente", focus: "último toque educado que pide un sí o un no." },
    ],
    fields: [
      {
        name: "quoteSummary",
        label: "Qué incluía el presupuesto",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 800,
        placeholder: "Reforma de baño completo, 4.800€, plazo de 2 semanas...",
      },
      {
        name: "clientName",
        label: "Nombre del cliente (opcional)",
        type: "text",
        maxLength: 80,
        placeholder: "Marta",
      },
      {
        name: "daysSince",
        label: "Días desde el envío",
        type: "select",
        required: true,
        defaultValue: "7-14",
        options: [
          { value: "3-7", label: "Entre 3 y 7 días" },
          { value: "7-14", label: "Entre 1 y 2 semanas" },
          { value: "14+", label: "Más de 2 semanas" },
        ],
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Cuenta qué incluía el presupuesto y cuánto hace que lo enviaste. Te devuelve 3 emails de seguimiento.",
  },
  {
    slug: "guion-llamada-comercial",
    name: "Generador de guiones de llamada",
    description: "Guiones de llamada a puerta fría adaptados a tu sector.",
    department: "ventas",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un formador de equipos comerciales español especializado en llamadas a puerta fría para pymes",
    mission:
      "redactar un guion de llamada comercial natural, con apertura, argumento y cierre, que un comercial pueda usar sin sonar a telemarketing",
    rules: [
      "La apertura debe decir quién llama y por qué a ese negocio concreto en menos de 15 segundos.",
      "Escribe frases para decir en voz alta, no párrafos para leer.",
      "Incluye una pregunta de descubrimiento antes de argumentar.",
      "Marca las pausas y los momentos de escucha con acotaciones entre corchetes, por ejemplo [espera respuesta].",
    ],
    variants: [
      {
        label: "Guion completo",
        focus: "apertura, descubrimiento, argumento y cierre con petición de reunión.",
      },
      {
        label: "Apertura alternativa",
        focus: "otra forma de arrancar la llamada, con un gancho distinto.",
      },
      {
        label: "Respuestas a un 'no tengo tiempo'",
        focus: "qué decir ante las dos evasivas más probables.",
      },
    ],
    fields: [
      {
        name: "offering",
        label: "Qué vendes",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 600,
        placeholder: "Mantenimiento informático mensual para despachos y asesorías...",
      },
      {
        name: "targetProfile",
        label: "A quién llamas",
        type: "text",
        required: true,
        maxLength: 150,
        placeholder: "Gerentes de asesorías de 5 a 20 empleados",
      },
      BUSINESS_NAME_FIELD,
      SECTOR_FIELD,
    ],
    resultNote:
      "Describe qué vendes y a quién llamas. Te devuelve un guion completo con apertura alternativa y manejo de evasivas.",
  },
  {
    slug: "manejo-objeciones",
    name: "Entrenador de objeciones de venta",
    description: "Respuestas preparadas para las objeciones que te frenan ventas.",
    department: "ventas",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un entrenador de ventas español que prepara respuestas a objeciones reales",
    mission:
      "dar tres formas distintas y honestas de responder a una objeción concreta de un cliente, sin trucos de manual americano",
    rules: [
      "Primero valida la objeción como legítima, después responde.",
      "Nada de técnicas enlatadas con nombre ('feel felt found'); lenguaje natural de conversación española.",
      "Si la objeción es razonable y el producto no encaja, una de las variantes debe contemplar retirarse con elegancia.",
      "Cada respuesta debe terminar devolviendo la conversación al cliente con una pregunta.",
    ],
    variants: [
      {
        label: "Reencuadre",
        focus: "cambia el marco de la objeción hacia el valor o el coste de no actuar.",
      },
      {
        label: "Prueba",
        focus: "responde con un dato, ejemplo o garantía que reduzca el riesgo percibido.",
      },
      { label: "Directa", focus: "respuesta franca y corta, admitiendo lo que haya que admitir." },
    ],
    fields: [
      {
        name: "objection",
        label: "Objeción del cliente",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 5,
        maxLength: 500,
        placeholder: "Es más caro que lo que pago ahora...",
      },
      {
        name: "offering",
        label: "Qué vendes",
        type: "text",
        required: true,
        maxLength: 200,
        placeholder: "Software de gestión de reservas, 49€/mes",
      },
      {
        name: "context",
        label: "Contexto (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 400,
        placeholder: "Es un restaurante que usa una libreta y el teléfono...",
      },
    ],
    resultNote:
      "Escribe la objeción tal y como te la dicen. Te devuelve 3 maneras distintas de responderla.",
  },
  {
    slug: "email-reactivacion-clientes",
    name: "Reactivador de clientes dormidos",
    description: "Emails para recuperar clientes que dejaron de comprar.",
    department: "ventas",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un responsable comercial español experto en recuperar clientes inactivos",
    mission:
      "redactar un email que retome la relación con un cliente que hace tiempo que no compra, sin culparle y con un motivo real para volver",
    rules: [
      "Nunca empieces con 'hace tiempo que no sabemos de ti' como reproche; usa un motivo positivo para escribir.",
      "El motivo para volver debe salir de los datos indicados (novedad, mejora, oferta), no inventarse.",
      "Reconoce la relación pasada de forma concreta si se indica qué compraba.",
      "Longitud: 50 a 110 palabras. Incluye la línea 'Asunto: ...' al principio de cada variante.",
    ],
    variants: [
      {
        label: "Novedad",
        focus: "usa la novedad u oferta indicada como excusa para retomar el contacto.",
      },
      { label: "Personal", focus: "tono cercano de negocio pequeño, de persona a persona." },
      {
        label: "Feedback",
        focus: "pide su opinión sobre por qué dejó de comprar, sin presión de venta.",
      },
    ],
    fields: [
      {
        name: "clientContext",
        label: "Qué compraba el cliente",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 600,
        placeholder: "Venía cada mes a mantenimiento de fisioterapia, dejó de venir en enero...",
      },
      {
        name: "hook",
        label: "Novedad u oferta para volver (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 400,
        placeholder: "Hemos ampliado horario de tardes y hay bono de 5 sesiones...",
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Cuenta qué compraba y qué puedes ofrecerle ahora. Te devuelve 3 emails de reactivación.",
  },
  {
    slug: "propuesta-comercial",
    name: "Redactor de propuestas comerciales",
    description: "Convierte un briefing en una propuesta estructurada y persuasiva.",
    department: "ventas",
    tier: "scale",
    creditsCost: 4,
    model: "opus-4.7",
    role: "un consultor comercial senior español que redacta propuestas ganadoras para pymes",
    mission:
      "convertir el briefing de una oportunidad en el texto completo de una propuesta comercial: contexto, solución, alcance y condiciones",
    rules: [
      "Estructura la propuesta desde el problema del cliente, no desde el catálogo del proveedor.",
      "El alcance debe listar qué incluye y, explícitamente, qué no incluye.",
      "Usa los precios y plazos indicados tal cual; si faltan, deja el hueco marcado como [PRECIO] o [PLAZO], nunca lo inventes.",
      "Evita superlativos; la persuasión sale de la claridad y de entender el problema.",
    ],
    variants: [
      {
        label: "Resumen ejecutivo",
        focus: "una página: situación, propuesta de valor y resultado esperado.",
      },
      {
        label: "Propuesta completa",
        focus:
          "contexto, solución detallada, alcance con inclusiones y exclusiones, plan de trabajo.",
      },
      {
        label: "Condiciones y cierre",
        focus: "precio, forma de pago, validez de la oferta y siguiente paso para aceptar.",
      },
    ],
    fields: [
      {
        name: "brief",
        label: "Briefing de la oportunidad",
        type: "textarea",
        required: true,
        rows: 6,
        minLength: 40,
        maxLength: 2000,
        placeholder:
          "Cliente: cadena de 3 gimnasios. Problema: gestionan altas y bajas a mano. Ofrecemos implantar nuestro software, migrar datos y formar al equipo...",
        hint: "Cliente, problema, qué ofreces, precio y plazos si los tienes.",
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Pega el briefing de la oportunidad. Te devuelve resumen ejecutivo, propuesta completa y condiciones.",
    maxTokens: 3000,
    minVariantChars: 100,
  },
  {
    slug: "resumen-llamada-comercial",
    name: "Resumidor de llamadas comerciales",
    description: "Pega la transcripción y recibe resumen, dolores del cliente y próximos pasos.",
    department: "ventas",
    tier: "business",
    creditsCost: 3,
    model: "sonnet-4.6",
    role: "un director comercial español que analiza llamadas de venta para sacar lo accionable",
    mission:
      "analizar la transcripción o las notas de una llamada comercial y extraer el resumen, los dolores del cliente y los próximos pasos comprometidos",
    rules: [
      "Distingue entre lo que el cliente dijo literalmente y lo que se deduce; marca las deducciones como tales.",
      "Los próximos pasos deben tener responsable y plazo si se mencionaron; si no, indícalo como pendiente de fijar.",
      "Si la transcripción no da para conclusiones sólidas, dilo en lugar de rellenar.",
      "No inventes citas textuales.",
    ],
    variants: [
      {
        label: "Resumen",
        focus: "qué se habló, en qué punto está la oportunidad y temperatura del cliente.",
      },
      {
        label: "Dolores y señales",
        focus: "problemas expresados por el cliente, objeciones y señales de compra.",
      },
      {
        label: "Próximos pasos",
        focus: "compromisos de ambas partes, con responsable y plazo cuando exista.",
      },
    ],
    fields: [
      {
        name: "transcript",
        label: "Transcripción o notas de la llamada",
        type: "textarea",
        required: true,
        rows: 8,
        minLength: 50,
        maxLength: 2000,
        placeholder: "Pega aquí la transcripción o tus notas de la llamada...",
        hint: "Vale una transcripción automática o tus notas. La subida de audio llegará más adelante.",
      },
      {
        name: "dealContext",
        label: "Contexto de la oportunidad (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Segunda llamada, ya vieron demo la semana pasada",
      },
    ],
    resultNote:
      "Pega la transcripción o tus notas. Te devuelve resumen, dolores del cliente y próximos pasos.",
    maxTokens: 2000,
  },
  {
    slug: "mensaje-linkedin",
    name: "Redactor de mensajes de LinkedIn",
    description: "Solicitudes de contacto y seguimientos que no parecen spam.",
    department: "ventas",
    tier: "business",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un especialista español en social selling que escribe mensajes de LinkedIn que la gente contesta",
    mission:
      "redactar la nota de conexión y los mensajes de seguimiento para abordar a un contacto profesional en LinkedIn sin parecer un bot de prospección",
    rules: [
      "La nota de conexión tiene un máximo real de 200 caracteres; respétalo.",
      "Prohibido el pitch en el primer mensaje; primero contexto común o interés genuino.",
      "Nada de halagos genéricos ('me encanta tu perfil'); la personalización sale de los datos aportados.",
      "El seguimiento propone una conversación, no una compra.",
    ],
    variants: [
      {
        label: "Nota de conexión",
        focus: "menos de 200 caracteres, con el motivo real del contacto.",
      },
      {
        label: "Primer mensaje",
        focus: "tras aceptar: contexto, valor y una pregunta fácil de contestar.",
      },
      {
        label: "Seguimiento",
        focus: "si no contesta en una semana: breve, con un recurso o ángulo nuevo.",
      },
    ],
    fields: [
      {
        name: "targetProfile",
        label: "A quién escribes",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 500,
        placeholder: "Directora de RRHH de una empresa logística de 80 empleados en Zaragoza...",
      },
      {
        name: "offering",
        label: "Qué ofreces",
        type: "text",
        required: true,
        maxLength: 200,
        placeholder: "Plataforma de formación bonificada para plantillas",
      },
      {
        name: "commonGround",
        label: "Punto en común (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Ambos estuvimos en la feria de logística de octubre",
      },
    ],
    resultNote:
      "Describe a quién escribes y qué ofreces. Te devuelve nota de conexión, primer mensaje y seguimiento.",
  },
  {
    slug: "calificador-leads",
    name: "Calificador de leads",
    description: "Evalúa un lead, puntúa su encaje y te dice qué preguntar.",
    department: "ventas",
    tier: "scale",
    creditsCost: 3,
    model: "opus-4.7",
    role: "un director comercial español metódico que califica oportunidades antes de invertir tiempo en ellas",
    mission:
      "evaluar los datos disponibles de un lead frente al cliente ideal descrito, puntuar su encaje y señalar qué falta por averiguar",
    rules: [
      "Puntúa el encaje de 1 a 10 y justifica la nota con los datos disponibles, criterio a criterio.",
      "Sé explícito con lo que NO se sabe; la lista de preguntas pendientes vale tanto como la nota.",
      "Si el lead encaja mal, dilo claro y recomienda no invertir tiempo; descartar también es calificar.",
      "Las preguntas recomendadas deben poder hacerse en una llamada corta.",
    ],
    variants: [
      {
        label: "Veredicto",
        focus: "nota de encaje 1-10, justificación resumida y recomendación de actuar o descartar.",
      },
      {
        label: "Análisis por criterios",
        focus: "encaje por necesidad, presupuesto, autoridad y urgencia con lo que se sabe.",
      },
      {
        label: "Preguntas pendientes",
        focus: "qué averiguar para confirmar o descartar, en orden de importancia.",
      },
    ],
    fields: [
      {
        name: "leadData",
        label: "Datos del lead",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1500,
        placeholder:
          "Empresa de catering, 12 empleados, preguntó por el plan medio, dice que decide la dueña, quieren empezar 'pronto'...",
      },
      {
        name: "idealCustomer",
        label: "Tu cliente ideal",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 600,
        placeholder: "Negocios de alimentación de 5 a 50 empleados con reparto propio...",
      },
    ],
    resultNote:
      "Pega lo que sabes del lead y describe tu cliente ideal. Te devuelve nota de encaje, análisis y preguntas.",
    maxTokens: 2200,
  },
  {
    slug: "respuesta-negociacion",
    name: "Asistente de negociación de precios",
    description: "Qué responder cuando el cliente pide descuento.",
    department: "ventas",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un negociador comercial español que defiende el precio sin perder al cliente",
    mission:
      "redactar respuestas a una petición de descuento que protejan el margen: defender el precio, ceder con contrapartida o dar una alternativa más barata recortando alcance",
    rules: [
      "Nunca concedas descuento sin contrapartida (volumen, plazo, pago anticipado, alcance menor).",
      "Defender el precio exige re-anclar en el valor, no repetir 'es lo que cuesta'.",
      "La alternativa barata recorta alcance de forma explícita, no calidad.",
      "Mantén el respeto por la petición del cliente; pedir descuento es legítimo.",
    ],
    variants: [
      {
        label: "Defender el precio",
        focus: "mantiene el precio re-anclando en el valor y el coste de la alternativa.",
      },
      {
        label: "Ceder con contrapartida",
        focus: "acepta mejorar condiciones a cambio de algo concreto.",
      },
      {
        label: "Opción reducida",
        focus: "propone una versión más barata recortando alcance claramente.",
      },
    ],
    fields: [
      {
        name: "request",
        label: "Qué ha pedido el cliente",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 600,
        placeholder:
          "Dice que le gusta pero que solo puede pagar 3.500€ de los 4.200€ del presupuesto...",
      },
      {
        name: "offering",
        label: "Qué incluye tu oferta",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 600,
        placeholder: "Diseño web completo, 6 páginas, textos incluidos, mantenimiento 3 meses...",
      },
      {
        name: "margin",
        label: "Margen de maniobra real (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Podría bajar hasta 3.900€ o quitar el mantenimiento",
      },
      TONE_FIELD,
    ],
    resultNote:
      "Cuenta qué ha pedido el cliente y qué margen tienes. Te devuelve 3 estrategias de respuesta redactadas.",
  },
];
