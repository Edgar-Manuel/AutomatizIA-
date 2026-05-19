import {
  IconCalc,
  IconCamera,
  IconFinance,
  IconHR,
  IconMail,
  IconMarketing,
  IconOps,
  IconPhone,
  IconReceipt,
  IconReview,
  IconSales,
  IconSupport,
  type LucideLikeIcon,
} from "./icons";

export type Department = {
  id: string;
  name: string;
  count: number;
  Icon: LucideLikeIcon;
};

export type FeaturedAgent = {
  id: string;
  name: string;
  desc: string;
  dept: string;
  Icon: LucideLikeIcon;
  color: "brand" | "mint" | "coral";
};

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  avatarBg: string;
  initials: string;
  metric: string;
  quote: string;
  agent: string;
};

export type Plan = {
  id: string;
  name: string;
  pitch: string;
  monthly: number;
  yearly: number;
  credits: number;
  features: string[];
  cta: string;
  recommended?: boolean;
};

export type Faq = {
  q: string;
  a: string;
};

export const DEPARTMENTS: Department[] = [
  { id: "ventas", name: "Ventas", count: 11, Icon: IconSales },
  { id: "marketing", name: "Marketing", count: 9, Icon: IconMarketing },
  { id: "soporte", name: "Atención Cliente", count: 8, Icon: IconSupport },
  { id: "ops", name: "Operaciones", count: 7, Icon: IconOps },
  { id: "rrhh", name: "RRHH", count: 8, Icon: IconHR },
  { id: "finanzas", name: "Finanzas", count: 7, Icon: IconFinance },
];

export const FEATURED_AGENTS: FeaturedAgent[] = [
  {
    id: "reviews",
    name: "Generador de respuestas a reseñas Google",
    desc: "Responde a reseñas con el tono de tu negocio en 6 segundos.",
    dept: "Atención Cliente",
    Icon: IconReview,
    color: "mint",
  },
  {
    id: "cold",
    name: "Redactor de emails de prospección en frío",
    desc: "Escribe secuencias de 3 emails personalizados por lead.",
    dept: "Ventas",
    Icon: IconMail,
    color: "brand",
  },
  {
    id: "calls",
    name: "Resumidor de llamadas comerciales",
    desc: "Sube el audio, recibes resumen, dolor del cliente y próximos pasos.",
    dept: "Ventas",
    Icon: IconPhone,
    color: "brand",
  },
  {
    id: "finiquito",
    name: "Calculador de finiquitos",
    desc: "Indemnización, vacaciones y pagas pendientes con desglose legal.",
    dept: "RRHH",
    Icon: IconCalc,
    color: "coral",
  },
  {
    id: "tickets",
    name: "Conciliador de tickets de gastos",
    desc: "Lee tickets en foto, los categoriza y exporta a tu contabilidad.",
    dept: "Finanzas",
    Icon: IconReceipt,
    color: "mint",
  },
  {
    id: "instagram",
    name: "Generador de copys para Instagram",
    desc: "5 variantes con hashtags y CTA según tu calendario editorial.",
    dept: "Marketing",
    Icon: IconCamera,
    color: "coral",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marta Ríos",
    role: "Dueña",
    company: "Clínica Dental Ríos · Valencia",
    avatarBg: "linear-gradient(135deg,#f7c7b0,#e6634d)",
    initials: "MR",
    metric: "Ahorro 6 horas a la semana",
    quote:
      "Antes contestaba las reseñas yo a mano por la noche. Ahora respondo 40 en diez minutos y suenan a mí, no a un robot.",
    agent: "Respuestas a reseñas",
  },
  {
    name: "Javier Mendoza",
    role: "Director comercial",
    company: "Logística Cantábrica · Bilbao",
    avatarBg: "linear-gradient(135deg,#cdc6ff,#5747e8)",
    initials: "JM",
    metric: "+38% emails abiertos",
    quote:
      "El equipo prospecta el doble de cuentas. Los emails llegan personalizados y los responsables comerciales solo revisan y envían.",
    agent: "Prospección en frío",
  },
  {
    name: "Lucía Pereira",
    role: "Responsable de RRHH",
    company: "Distribuciones Alba · Sevilla",
    avatarBg: "linear-gradient(135deg,#bfe9d6,#1fae7c)",
    initials: "LP",
    metric: "4 finiquitos por hora",
    quote:
      "Lo que antes era una mañana entera con la gestoría, ahora son cinco minutos por persona y todo cuadrado al céntimo.",
    agent: "Calculador de finiquitos",
  },
];

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    pitch: "Para empezar a probar agentes en tu día a día.",
    monthly: 29,
    yearly: 24,
    credits: 200,
    features: [
      "Acceso a 20 agentes esenciales",
      "1 puesto incluido",
      "Historial de 30 días",
      "Exportación a PDF y CSV",
      "Soporte por email",
    ],
    cta: "Empezar gratis",
  },
  {
    id: "business",
    name: "Business",
    pitch: "Para equipos que ya saben qué procesos automatizar.",
    monthly: 99,
    yearly: 82,
    credits: 1000,
    features: [
      "Acceso a los 50 agentes",
      "5 puestos incluidos",
      "Plantillas guardadas por equipo",
      "Integración con Gmail y Outlook",
      "Soporte prioritario por chat",
    ],
    cta: "Probar Business",
    recommended: true,
  },
  {
    id: "scale",
    name: "Scale",
    pitch: "Para empresas que mueven volumen y necesitan más fuelle.",
    monthly: 299,
    yearly: 249,
    credits: 4000,
    features: [
      "Agentes premium con modelos avanzados",
      "20 puestos incluidos",
      "API y webhooks",
      "SSO y permisos por rol",
      "Soporte prioritario y onboarding 1:1",
    ],
    cta: "Hablar con ventas",
  },
];

export const FAQS: Faq[] = [
  {
    q: "¿Qué son los créditos?",
    a: "Cada ejecución de un agente consume créditos según su complejidad. Un email de prospección cuesta 1 crédito, un resumen de llamada con audio cuesta 4. Verás el coste antes de ejecutar y nunca te cobramos por intentos fallidos.",
  },
  {
    q: "¿Necesito saber de IA?",
    a: "No. Abres el agente, rellenas un formulario corto (nombre del cliente, contexto, tono) y recibes el resultado. No hay prompts que aprender, ni modelos que elegir, ni nada que entrenar.",
  },
  {
    q: "¿Mis datos son privados?",
    a: "Sí. Tus datos viven en servidores europeos, no entrenamos modelos con ellos y firmamos un contrato de encargado del tratamiento (RGPD) en el momento del alta. Puedes borrar tu historial cuando quieras.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, sin permanencia ni penalización. Cancelas desde tu panel y conservas el acceso hasta el final del periodo que ya pagaste.",
  },
  {
    q: "¿Qué pasa si me quedo sin créditos?",
    a: "Te avisamos al 80% y al 100%. Puedes recargar al instante por bolsas de 100, 500 o 2.000 créditos, o subir de plan. Nunca te cortamos el servicio sin avisar.",
  },
  {
    q: "¿Funciona en español?",
    a: "Está pensado en español. Todos los agentes leen y escriben en castellano, catalán, gallego y euskera. Inglés y portugués llegan en otoño de 2026.",
  },
];
