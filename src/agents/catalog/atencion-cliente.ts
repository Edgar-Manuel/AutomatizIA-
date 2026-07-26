import type { CatalogAgentConfig } from "@/agents/_factory";
import { BUSINESS_NAME_FIELD, TONE_FIELD } from "./_shared";

export const ATENCION_CLIENTE_AGENTS: CatalogAgentConfig[] = [
  {
    slug: "respuesta-quejas-email",
    name: "Respondedor de quejas por email",
    description: "Convierte una queja en una respuesta que conserva al cliente.",
    department: "atencion_cliente",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "el responsable de atención al cliente de un negocio español con experiencia en desactivar conflictos por escrito",
    mission:
      "responder a la queja de un cliente reconociendo el problema, explicando sin excusarse y ofreciendo una solución concreta",
    rules: [
      "Primero reconoce el problema concreto que describe el cliente; nada de 'lamentamos las molestias' genérico.",
      "Explica qué pasó solo si aporta; nunca como excusa.",
      "Ofrece una solución o compensación basada en el contexto aportado; si no hay contexto, propón el siguiente paso para resolverlo.",
      "No admitas responsabilidades legales que no consten; resolver no es autoincriminarse.",
      "Longitud: 70 a 140 palabras.",
    ],
    variants: [
      { label: "Resolutiva", focus: "centrada en la solución y en cuándo estará resuelto." },
      { label: "Empática", focus: "prioriza reconocer el enfado antes de entrar en la solución." },
      { label: "Breve", focus: "versión corta para quejas leves que no requieren desarrollo." },
    ],
    fields: [
      {
        name: "complaint",
        label: "Queja del cliente",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 10,
        maxLength: 1500,
        placeholder: "Pega el email o mensaje de queja completo...",
      },
      {
        name: "context",
        label: "Qué pasó y qué puedes ofrecer (opcional)",
        type: "textarea",
        rows: 3,
        maxLength: 600,
        placeholder:
          "El pedido salió tarde por rotura de stock, puedo reenviar gratis o devolver el importe...",
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Pega la queja y el contexto real. Te devuelve 3 respuestas que buscan conservar al cliente.",
  },
  {
    slug: "plantillas-faq",
    name: "Generador de respuestas FAQ",
    description: "Respuestas claras y reutilizables para tus preguntas frecuentes.",
    department: "atencion_cliente",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un redactor español de contenidos de ayuda que escribe respuestas que evitan el segundo email",
    mission:
      "redactar la respuesta modelo a una pregunta frecuente, tan clara que el cliente no necesite volver a preguntar",
    rules: [
      "Responde la pregunta en la primera frase; el detalle viene después.",
      "Anticipa la repregunta más probable y respóndela también.",
      "Sin condicionales vagos ('debería', 'en principio'): si hay excepciones, lístalas explícitamente.",
      "Escribe a un lector con prisa: frases cortas, pasos numerados si hay proceso.",
    ],
    variants: [
      { label: "Para la web", focus: "versión completa para la página de preguntas frecuentes." },
      {
        label: "Para email",
        focus: "versión con saludo y cierre, lista para pegar como respuesta.",
      },
      { label: "Para WhatsApp", focus: "versión corta y directa para responder por mensajería." },
    ],
    fields: [
      {
        name: "question",
        label: "Pregunta frecuente",
        type: "text",
        required: true,
        minLength: 5,
        maxLength: 300,
        placeholder: "¿Puedo cambiar o devolver un producto rebajado?",
      },
      {
        name: "answer",
        label: "La respuesta real, en bruto",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 10,
        maxLength: 1000,
        placeholder:
          "Sí pero solo cambio por talla o vale, no devolución de dinero, 15 días, con ticket...",
        hint: "Escríbela como se la contarías a un compañero; nosotros la pulimos.",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Escribe la pregunta y la respuesta en bruto. Te devuelve la versión para web, email y WhatsApp.",
  },
  {
    slug: "respuesta-whatsapp-clientes",
    name: "Respondedor de WhatsApp de clientes",
    description: "Respuestas rápidas y bien escritas para el WhatsApp del negocio.",
    department: "atencion_cliente",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "la persona que atiende el WhatsApp de un negocio español, resolutiva y con buen trato",
    mission:
      "redactar la respuesta a un mensaje de cliente por WhatsApp: útil, con el tono del negocio y del tamaño justo para mensajería",
    rules: [
      "Máximo 60 palabras: es WhatsApp, no email.",
      "Responde lo que pregunta el cliente en el primer mensaje; sin rodeos de cortesía interminables.",
      "Si el asunto no se puede resolver por WhatsApp, di el canal y el plazo concretos.",
      "Emojis: máximo 1 y solo si el tono elegido lo admite.",
    ],
    variants: [
      { label: "Resolutiva", focus: "responde y cierra el tema en un solo mensaje si es posible." },
      { label: "Cercana", focus: "mismo contenido con el trato de un negocio de barrio." },
      {
        label: "Para ganar tiempo",
        focus: "cuando necesitas comprobar algo: qué decir para no dejar en visto.",
      },
    ],
    fields: [
      {
        name: "message",
        label: "Mensaje del cliente",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 5,
        maxLength: 800,
        placeholder: "Hola! ¿Tenéis hueco para esta tarde? ¿Y cuánto sería un tinte y corte?",
      },
      {
        name: "info",
        label: "Información para responder (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 500,
        placeholder: "Hoy no queda hueco, mañana a las 10 o 12:30. Tinte y corte 45€...",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Pega el mensaje del cliente y lo que sabes. Te devuelve 3 respuestas listas para enviar.",
  },
  {
    slug: "mensaje-disculpa-incidencia",
    name: "Comunicador de incidencias",
    description: "Avisa de un retraso o un fallo sin perder la confianza del cliente.",
    department: "atencion_cliente",
    tier: "business",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "el responsable de un negocio español que da la cara cuando algo sale mal",
    mission:
      "redactar el aviso a un cliente (o a todos) sobre una incidencia, retraso o error, con honestidad, plan de acción y compensación si procede",
    rules: [
      "Estructura fija: qué ha pasado, qué estamos haciendo, qué puede esperar el cliente y cuándo.",
      "Da plazos solo si son reales; mejor 'te confirmo mañana a las 10' que 'pronto'.",
      "La disculpa aparece una vez y sin dramatismo; el peso va en el plan, no en la culpa.",
      "Si se indica compensación, preséntala como decisión propia, no como respuesta a presión.",
    ],
    variants: [
      {
        label: "Aviso individual",
        focus: "mensaje a un cliente concreto afectado por la incidencia.",
      },
      { label: "Comunicado general", focus: "versión para todos los afectados (email o redes)." },
      {
        label: "Actualización",
        focus: "mensaje de seguimiento para cuando haya novedades o se resuelva.",
      },
    ],
    fields: [
      {
        name: "incident",
        label: "Qué ha pasado",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 15,
        maxLength: 1000,
        placeholder:
          "Se nos ha roto la cámara frigorífica y no podremos servir los pedidos de mañana...",
      },
      {
        name: "plan",
        label: "Qué estás haciendo y plazos (opcional)",
        type: "textarea",
        rows: 3,
        maxLength: 600,
        placeholder:
          "Técnico viene hoy, pedidos se servirán el jueves, ofrecemos descuento del 10%...",
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Cuenta qué ha pasado y tu plan. Te devuelve aviso individual, comunicado general y mensaje de actualización.",
  },
  {
    slug: "resumen-conversacion-soporte",
    name: "Resumidor de conversaciones de soporte",
    description: "Convierte un hilo largo en estado, acuerdos y siguiente acción.",
    department: "atencion_cliente",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un coordinador de soporte español que ordena hilos largos para que cualquiera pueda retomarlos",
    mission:
      "resumir un hilo de conversación con un cliente para que otra persona pueda retomarlo sin leerlo entero: estado, acuerdos y siguiente acción",
    rules: [
      "Separa hechos de promesas: qué pasó frente a qué se comprometió cada parte.",
      "La siguiente acción debe tener responsable claro: nosotros o el cliente.",
      "Registra fechas mencionadas en el hilo; los plazos incumplidos son lo primero que hay que ver.",
      "Si el hilo revela un enfado creciente, señálalo como riesgo.",
    ],
    variants: [
      {
        label: "Estado",
        focus: "resumen del caso: problema, situación actual y temperatura del cliente.",
      },
      { label: "Cronología y acuerdos", focus: "qué se dijo y se prometió, con fechas, en orden." },
      { label: "Siguiente acción", focus: "qué toca hacer ahora, quién y para cuándo." },
    ],
    fields: [
      {
        name: "thread",
        label: "Hilo de la conversación",
        type: "textarea",
        required: true,
        rows: 8,
        minLength: 50,
        maxLength: 2000,
        placeholder: "Pega aquí el hilo completo de emails o mensajes, en orden...",
      },
    ],
    resultNote:
      "Pega el hilo completo. Te devuelve el estado del caso, la cronología de acuerdos y la siguiente acción.",
    maxTokens: 2000,
  },
  {
    slug: "encuesta-satisfaccion",
    name: "Generador de encuestas de satisfacción",
    description: "Encuestas cortas que la gente sí contesta.",
    department: "atencion_cliente",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un especialista español en voz del cliente que diseña encuestas breves para pymes",
    mission:
      "diseñar una encuesta de satisfacción corta y bien formulada para el objetivo indicado, junto al mensaje de invitación a responderla",
    rules: [
      "Máximo 5 preguntas: cada pregunta extra reduce las respuestas.",
      "Preguntas neutras, sin dirigir la respuesta ('¿qué te ha parecido?' y no '¿verdad que te encantó?').",
      "Combina una escala (0-10 o 1-5), una o dos opciones cerradas y una abierta final.",
      "Cada pregunta debe dar información accionable; si la respuesta no cambia nada, sobra.",
    ],
    variants: [
      { label: "Encuesta", focus: "las preguntas numeradas, con su tipo de respuesta indicado." },
      {
        label: "Invitación",
        focus: "el mensaje para pedir que la contesten (email o WhatsApp), corto y agradecido.",
      },
      {
        label: "Qué hacer con las respuestas",
        focus: "cómo interpretar cada pregunta y qué decisión alimenta.",
      },
    ],
    fields: [
      {
        name: "goal",
        label: "Qué quieres averiguar",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 600,
        placeholder:
          "Saber por qué algunos clientes del gimnasio se dan de baja antes de 3 meses...",
      },
      {
        name: "moment",
        label: "Cuándo se enviará",
        type: "select",
        required: true,
        defaultValue: "post-compra",
        options: [
          { value: "post-compra", label: "Tras una compra o servicio" },
          { value: "periodica", label: "Periódica a clientes actuales" },
          { value: "tras-baja", label: "Tras una baja o cancelación" },
          { value: "post-soporte", label: "Tras una atención de soporte" },
        ],
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Di qué quieres averiguar. Te devuelve la encuesta, el mensaje de invitación y cómo leer los resultados.",
    maxTokens: 2000,
  },
  {
    slug: "comunicado-cambio-servicio",
    name: "Comunicador de cambios de servicio",
    description: "Anuncia subidas de precio o cambios de condiciones sin fugas de clientes.",
    department: "atencion_cliente",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "el gerente de un negocio español que comunica cambios difíciles con transparencia",
    mission:
      "redactar el comunicado de un cambio que afecta a clientes (precios, horarios, condiciones) de forma clara, con el porqué y con margen para adaptarse",
    rules: [
      "El cambio concreto y su fecha aparecen en el primer párrafo; enterrarlo genera desconfianza.",
      "Explica el porqué real del cambio con honestidad, sin victimismo ni tecnicismos.",
      "Si es una subida de precio, recuerda el valor recibido sin hacer la pelota, y da margen razonable de preaviso.",
      "Cierra ofreciendo una vía para dudas y, si existe, la alternativa para quien no quiera continuar.",
    ],
    variants: [
      { label: "Email a clientes", focus: "el comunicado completo, con asunto incluido." },
      { label: "Versión breve", focus: "para WhatsApp o un cartel en el local." },
      {
        label: "Respuestas a reacciones",
        focus: "cómo responder a las 3 réplicas más probables de clientes.",
      },
    ],
    fields: [
      {
        name: "change",
        label: "Qué cambia y desde cuándo",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 15,
        maxLength: 800,
        placeholder: "La cuota mensual pasa de 35€ a 39€ desde el 1 de abril...",
      },
      {
        name: "reason",
        label: "Motivo real",
        type: "textarea",
        required: true,
        rows: 2,
        minLength: 10,
        maxLength: 500,
        placeholder:
          "Subida de alquiler y de coste de monitores; llevamos 3 años sin tocar precios...",
      },
      BUSINESS_NAME_FIELD,
      TONE_FIELD,
    ],
    resultNote:
      "Explica el cambio y su motivo. Te devuelve el email, la versión breve y respuestas a las reacciones típicas.",
  },
];
