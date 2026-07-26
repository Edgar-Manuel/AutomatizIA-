import type { AgentFormSpec } from "@/agents/_form";
import { TONE_LABELS, TONE_OPTIONS } from "./schemas";

export const formSpec: AgentFormSpec = {
  resultNote:
    "Rellena la reseña, elige tono y pulsa Ejecutar. Te devuelve 3 variantes en menos de 10 segundos.",
  expectedVariants: 3,
  fields: [
    {
      name: "review",
      label: "Reseña del cliente",
      type: "textarea",
      required: true,
      hint: "Pega el texto completo, sin recortar.",
      placeholder: "Llevo años yendo y el trato es excelente...",
      rows: 5,
      minLength: 15,
      maxLength: 2000,
    },
    {
      name: "rating",
      label: "Estrellas",
      type: "stars",
      required: true,
      defaultValue: 4,
    },
    {
      name: "tone",
      label: "Tono",
      type: "select",
      required: true,
      defaultValue: "cercano-profesional",
      options: TONE_OPTIONS.map((t) => ({ value: t, label: TONE_LABELS[t] })),
    },
    {
      name: "businessName",
      label: "Nombre del negocio",
      type: "text",
      required: true,
      maxLength: 80,
      placeholder: "Clínica Dental Ríos",
    },
    {
      name: "reviewerName",
      label: "Cliente (opcional)",
      type: "text",
      hint: "Si lo conoces, lo usamos al saludar.",
      maxLength: 80,
      placeholder: "Carlos M.",
    },
  ],
};
