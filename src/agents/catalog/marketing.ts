import type { CatalogAgentConfig } from "@/agents/_factory";
import { BUSINESS_NAME_FIELD, TONE_FIELD } from "./_shared";

export const MARKETING_AGENTS: CatalogAgentConfig[] = [
  {
    slug: "newsletter-redactor",
    name: "Redactor de newsletters",
    description: "Tu newsletter mensual redactada a partir de tus novedades.",
    department: "marketing",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "el redactor de newsletters de un negocio español pequeño, con estilo de carta a clientes, no de nota de prensa",
    mission:
      "convertir las novedades del mes en una newsletter breve que la gente lea entera y que termine en una acción clara",
    rules: [
      "Una sola idea principal por newsletter; el resto de novedades van en breves de una línea.",
      "El asunto va en la primera línea como 'Asunto: ...' y decide la apertura: concreto, sin mayúsculas gritonas ni emojis en ristra.",
      "Escribe como escribe el dueño del negocio a sus clientes, en primera persona.",
      "Cierra con una única llamada a la acción.",
    ],
    variants: [
      { label: "Cercana", focus: "tono de carta personal del dueño a sus clientes." },
      { label: "Informativa", focus: "va al grano con las novedades, estilo boletín útil." },
      {
        label: "Con historia",
        focus: "abre con una anécdota real del negocio que conecte con la novedad.",
      },
    ],
    fields: [
      {
        name: "updates",
        label: "Novedades del mes",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1200,
        placeholder:
          "Nuevo horario de tardes, hemos incorporado a una fisioterapeuta, taller de espalda el día 20...",
      },
      BUSINESS_NAME_FIELD,
      {
        name: "audience",
        label: "A quién se la envías",
        type: "text",
        required: true,
        maxLength: 150,
        placeholder: "Clientes habituales de la clínica",
      },
      {
        name: "cta",
        label: "Qué quieres que hagan (opcional)",
        type: "text",
        maxLength: 150,
        placeholder: "Reservar plaza en el taller del día 20",
      },
    ],
    resultNote: "Lista tus novedades del mes. Te devuelve 3 versiones completas de la newsletter.",
    maxTokens: 2200,
  },
  {
    slug: "descripcion-producto",
    name: "Redactor de fichas de producto",
    description: "Descripciones de producto que venden, para tienda online o catálogo.",
    department: "marketing",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un copywriter español de ecommerce especializado en fichas de producto",
    mission:
      "redactar la descripción de un producto que convierta características en beneficios y responda las dudas típicas antes de que frenen la compra",
    rules: [
      "Cada característica se traduce a qué gana el comprador; nada de listas de specs sin traducir.",
      "El primer párrafo debe funcionar solo: es lo único que muchos leerán.",
      "Usa las medidas, materiales y datos aportados tal cual; no añadas specs no indicadas.",
      "Evita adjetivos vacíos ('increíble', 'única'); concreción antes que entusiasmo.",
    ],
    variants: [
      {
        label: "Ficha completa",
        focus: "titular, párrafo de venta y lista de beneficios con sus datos.",
      },
      {
        label: "Versión corta",
        focus: "2 o 3 frases para marketplace o catálogo con espacio limitado.",
      },
      {
        label: "Enfoque alternativo",
        focus: "misma ficha vendiendo desde otro ángulo (otro uso u otro comprador).",
      },
    ],
    fields: [
      {
        name: "productData",
        label: "Datos del producto",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1200,
        placeholder:
          'Mochila de cuero para portátil de 15", hecha a mano en Ubrique, 3 bolsillos, 89€...',
        hint: "Características, materiales, medidas, precio... todo lo que tengas.",
      },
      {
        name: "buyer",
        label: "Quién lo compra",
        type: "text",
        required: true,
        maxLength: 150,
        placeholder: "Profesionales que van a diario a la oficina",
      },
      TONE_FIELD,
    ],
    resultNote:
      "Pega los datos del producto. Te devuelve la ficha completa, una versión corta y un ángulo alternativo.",
  },
  {
    slug: "respuesta-comentarios-rrss",
    name: "Respondedor de comentarios en redes",
    description: "Respuestas con criterio a comentarios buenos, malos y trolls.",
    department: "marketing",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "el community manager de un negocio español pequeño que responde comentarios con oficio",
    mission:
      "redactar la respuesta pública a un comentario en redes sociales, ya sea elogio, queja o provocación, protegiendo la reputación del negocio",
    rules: [
      "La respuesta es pública: escribe para quien lee, no solo para quien comenta.",
      "Ante quejas: reconoce, no discutas en público, y lleva el detalle a privado.",
      "Ante provocaciones sin fundamento: respuesta corta, educada y sin morder el anzuelo; una de las variantes puede ser no alimentar más el hilo.",
      "Máximo 60 palabras por respuesta; en redes lo largo pierde.",
    ],
    variants: [
      {
        label: "Recomendada",
        focus: "la respuesta con mejor equilibrio para ese comentario concreto.",
      },
      {
        label: "Más cercana",
        focus: "versión más cálida o con humor suave si el contexto lo permite.",
      },
      {
        label: "Más contenida",
        focus: "versión sobria y breve, para cuando conviene no extenderse.",
      },
    ],
    fields: [
      {
        name: "comment",
        label: "Comentario recibido",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 5,
        maxLength: 800,
        placeholder: "Pedí hace dos semanas y nadie me contesta por dónde va mi pedido!!",
      },
      {
        name: "context",
        label: "Contexto real (opcional)",
        type: "textarea",
        rows: 2,
        maxLength: 400,
        placeholder: "Hubo retraso del transportista, se le envió ayer con disculpa...",
        hint: "Qué pasó de verdad, para que la respuesta no prometa en falso.",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Pega el comentario y el contexto real. Te devuelve 3 respuestas públicas con distinto registro.",
  },
  {
    slug: "whatsapp-marketing",
    name: "Redactor de campañas de WhatsApp",
    description: "Mensajes de difusión que no acaban en bloqueo.",
    department: "marketing",
    tier: "starter",
    creditsCost: 1,
    model: "sonnet-4.6",
    role: "un especialista español en marketing por WhatsApp para negocios locales",
    mission:
      "redactar el mensaje de difusión de WhatsApp para una promoción o aviso, corto y personal, que aporte valor en vez de quemar la lista",
    rules: [
      "Máximo 70 palabras: en WhatsApp lo largo no se lee.",
      "Debe sonar a mensaje de persona, no a cuña de radio; sin mayúsculas gritonas.",
      "Emojis: máximo 2, con función, no decorativos.",
      "Incluye una vía de salida amable (responder BAJA o similar) cuando sea difusión masiva.",
      "El CTA debe poder cumplirse respondiendo al propio WhatsApp.",
    ],
    variants: [
      { label: "Directa", focus: "la promoción o aviso al grano, con el dato clave delante." },
      { label: "Personal", focus: "como si el dueño escribiera a un cliente de confianza." },
      {
        label: "Con urgencia honesta",
        focus: "usa el límite real (plazas, fechas, stock) si existe, sin presión artificial.",
      },
    ],
    fields: [
      {
        name: "announcement",
        label: "Qué quieres comunicar",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 10,
        maxLength: 600,
        placeholder: "Menú especial de San Valentín, 45€ por pareja, solo 20 mesas...",
      },
      {
        name: "audience",
        label: "A quién se lo envías",
        type: "text",
        required: true,
        maxLength: 150,
        placeholder: "Clientes que ya han reservado alguna vez",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Cuenta qué quieres comunicar. Te devuelve 3 mensajes de difusión listos para WhatsApp.",
  },
  {
    slug: "calendario-editorial",
    name: "Planificador de calendario editorial",
    description: "Un mes de ideas de contenido adaptadas a tu negocio.",
    department: "marketing",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un estratega de contenidos español que planifica redes de pymes con recursos limitados",
    mission:
      "proponer un mes de contenido realista para el negocio: qué publicar cada semana, en qué formato y con qué objetivo",
    rules: [
      "Planifica para un negocio con poco tiempo: contenido que se pueda producir con un móvil y media hora.",
      "Cada pieza lleva: día orientativo, formato, idea concreta y objetivo (vender, fidelizar, alcance).",
      "Varía la intención: máximo un tercio del contenido puede ser venta directa.",
      "Aprovecha fechas y temporada solo si encajan con el sector indicado, sin forzar efemérides.",
    ],
    variants: [
      {
        label: "Semanas 1 y 2",
        focus: "plan detallado de las dos primeras semanas, pieza a pieza.",
      },
      {
        label: "Semanas 3 y 4",
        focus: "plan detallado de las dos últimas semanas, pieza a pieza.",
      },
      {
        label: "Ideas de reserva",
        focus: "5 ideas comodín para días sin inspiración o huecos imprevistos.",
      },
    ],
    fields: [
      {
        name: "businessInfo",
        label: "Tu negocio",
        type: "textarea",
        required: true,
        rows: 4,
        minLength: 20,
        maxLength: 800,
        placeholder:
          "Tienda de bicicletas con taller propio en Sevilla, vendemos bicis urbanas y hacemos reparaciones...",
      },
      {
        name: "channel",
        label: "Canal principal",
        type: "select",
        required: true,
        defaultValue: "instagram",
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "facebook", label: "Facebook" },
          { value: "tiktok", label: "TikTok" },
          { value: "linkedin", label: "LinkedIn" },
        ],
      },
      {
        name: "monthGoal",
        label: "Objetivo del mes (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Llenar el taller en la campaña de vuelta al cole",
      },
    ],
    resultNote:
      "Describe tu negocio y tu canal. Te devuelve un mes de contenido planificado más ideas de reserva.",
    maxTokens: 2600,
    minVariantChars: 100,
  },
  {
    slug: "anuncio-google-ads",
    name: "Generador de anuncios de Google Ads",
    description: "Titulares y descripciones que cumplen los límites de caracteres.",
    department: "marketing",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un especialista español en Google Ads que escribe anuncios de búsqueda para pymes",
    mission:
      "redactar el material de un anuncio de búsqueda: titulares y descripciones dentro de los límites, alineados con la intención de búsqueda del cliente",
    rules: [
      "Titulares: máximo 30 caracteres cada uno. Descripciones: máximo 90 caracteres cada una. Cuenta antes de escribir e indica el recuento entre paréntesis al final de cada línea.",
      "Los titulares deben incluir variaciones con la palabra clave, con el beneficio y con la llamada a la acción.",
      "Nada de mayúsculas completas ni exclamaciones dobles: Google los rechaza.",
      "Usa la zona geográfica si se indica; la búsqueda local convierte mejor.",
    ],
    variants: [
      {
        label: "Titulares",
        focus: "10 titulares de máximo 30 caracteres, numerados, con recuento.",
      },
      {
        label: "Descripciones",
        focus: "4 descripciones de máximo 90 caracteres, numeradas, con recuento.",
      },
      { label: "Extensiones", focus: "enlaces de sitio y llamadas de texto destacado sugeridos." },
    ],
    fields: [
      {
        name: "offering",
        label: "Qué anuncias",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 600,
        placeholder: "Cerrajería 24 horas en Valencia, apertura de puertas desde 60€...",
      },
      {
        name: "keyword",
        label: "Palabra clave principal",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "cerrajero urgente valencia",
      },
      {
        name: "differentiator",
        label: "Tu ventaja frente a la competencia (opcional)",
        type: "text",
        maxLength: 200,
        placeholder: "Llegamos en menos de 20 minutos, precio cerrado por teléfono",
      },
    ],
    resultNote:
      "Indica qué anuncias y tu palabra clave. Te devuelve titulares, descripciones y extensiones dentro de límites.",
    maxTokens: 2200,
  },
  {
    slug: "post-blog-seo",
    name: "Redactor de artículos de blog SEO",
    description: "Esquema, introducción y SEO on-page para posicionar un artículo.",
    department: "marketing",
    tier: "scale",
    creditsCost: 4,
    model: "opus-4.7",
    role: "un redactor SEO español que posiciona blogs de pymes escribiendo para personas primero",
    mission:
      "preparar un artículo de blog optimizado: estructura completa de encabezados, introducción redactada y elementos SEO on-page",
    rules: [
      "La estructura debe responder la intención de búsqueda en los primeros encabezados, no al final.",
      "Encabezados informativos, no de suspense: el lector debe saber qué encontrará en cada sección.",
      "La introducción confirma al lector que está en el sitio correcto en las 2 primeras frases.",
      "Título SEO de máximo 60 caracteres y meta descripción de máximo 155, con recuento entre paréntesis.",
      "Prohibido el relleno SEO de repetir la palabra clave de forma antinatural.",
    ],
    variants: [
      {
        label: "Estructura",
        focus: "H1 y esquema completo de H2/H3 con una línea sobre qué cubre cada sección.",
      },
      {
        label: "Introducción",
        focus: "los 2 primeros párrafos del artículo, redactados y listos.",
      },
      {
        label: "SEO on-page",
        focus: "título SEO, meta descripción, URL sugerida y palabras clave secundarias.",
      },
    ],
    fields: [
      {
        name: "topic",
        label: "Tema del artículo",
        type: "textarea",
        required: true,
        rows: 3,
        minLength: 10,
        maxLength: 500,
        placeholder: "Cuánto cuesta reformar un baño en 2026: precios reales por partidas...",
      },
      {
        name: "keyword",
        label: "Palabra clave a posicionar",
        type: "text",
        required: true,
        maxLength: 100,
        placeholder: "cuanto cuesta reformar un baño",
      },
      {
        name: "audience",
        label: "Para quién escribes",
        type: "text",
        required: true,
        maxLength: 150,
        placeholder: "Propietarios que se plantean reformar y comparan precios",
      },
      BUSINESS_NAME_FIELD,
    ],
    resultNote:
      "Indica tema y palabra clave. Te devuelve estructura completa, introducción redactada y SEO on-page.",
    maxTokens: 2600,
    minVariantChars: 100,
  },
  {
    slug: "nota-de-prensa",
    name: "Redactor de notas de prensa",
    description: "Notas de prensa con estructura profesional para medios locales.",
    department: "marketing",
    tier: "business",
    creditsCost: 2,
    model: "sonnet-4.6",
    role: "un periodista español reconvertido a comunicación de pymes que escribe notas de prensa que los medios locales publican",
    mission:
      "convertir una noticia de empresa en una nota de prensa con estructura periodística que un medio local pueda publicar casi sin editar",
    rules: [
      "Estructura de pirámide invertida: el primer párrafo responde qué, quién, cuándo, dónde y por qué importa.",
      "Escribe en tercera persona; el autobombo va solo dentro de las citas entrecomilladas.",
      "Incluye una cita del responsable indicada como tal; constrúyela a partir de la información aportada.",
      "Titular informativo de máximo 12 palabras, sin adjetivos promocionales.",
      "El interés para el lector del medio manda: si la noticia es floja, el ángulo debe buscar el impacto local (empleo, novedad para vecinos, apertura).",
    ],
    variants: [
      {
        label: "Nota completa",
        focus: "titular, entradilla, cuerpo con cita y párrafo final sobre la empresa.",
      },
      { label: "Titulares alternativos", focus: "4 titulares con ángulos distintos para elegir." },
      {
        label: "Email al periodista",
        focus: "el correo breve con el que enviar la nota a un medio local.",
      },
    ],
    fields: [
      {
        name: "news",
        label: "La noticia",
        type: "textarea",
        required: true,
        rows: 5,
        minLength: 20,
        maxLength: 1200,
        placeholder:
          "Abrimos segundo local en el barrio de Ruzafa, crearemos 6 puestos de trabajo, apertura el 15 de marzo...",
      },
      BUSINESS_NAME_FIELD,
      {
        name: "spokesperson",
        label: "Portavoz y cargo (opcional)",
        type: "text",
        maxLength: 120,
        placeholder: "Ana Gil, fundadora",
      },
    ],
    resultNote:
      "Cuenta la noticia. Te devuelve la nota completa, titulares alternativos y el email para el periodista.",
    maxTokens: 2400,
    minVariantChars: 60,
  },
];
