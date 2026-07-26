import type { AgentFormSpec } from "@/agents/_form";
import { OBJECTIVE_LABELS, OBJECTIVE_OPTIONS, TONE_LABELS, TONE_OPTIONS } from "./schemas";

export const formSpec: AgentFormSpec = {
  resultNote:
    "Cuéntanos de qué va el post y pulsa Ejecutar. Te devuelve 5 copys con gancho, CTA y hashtags.",
  expectedVariants: 5,
  fields: [
    {
      name: "topic",
      label: "Tema del post",
      type: "textarea",
      required: true,
      hint: "Qué anuncias o de qué quieres hablar.",
      placeholder: "Nueva carta de otoño con platos de temporada y dos opciones sin gluten...",
      rows: 4,
      minLength: 10,
      maxLength: 400,
    },
    {
      name: "businessName",
      label: "Nombre del negocio",
      type: "text",
      required: true,
      maxLength: 80,
      placeholder: "Restaurante La Huerta",
    },
    {
      name: "objective",
      label: "Objetivo",
      type: "select",
      required: true,
      defaultValue: "vender",
      options: OBJECTIVE_OPTIONS.map((o) => ({ value: o, label: OBJECTIVE_LABELS[o] })),
    },
    {
      name: "tone",
      label: "Tono",
      type: "select",
      required: true,
      defaultValue: "cercano",
      options: TONE_OPTIONS.map((t) => ({ value: t, label: TONE_LABELS[t] })),
    },
    {
      name: "extraInfo",
      label: "Detalles extra (opcional)",
      type: "textarea",
      hint: "Precios, fechas, condiciones... solo lo que quieras que aparezca.",
      placeholder: "El menú degustación sale a 35€ de jueves a domingo.",
      rows: 3,
      maxLength: 300,
    },
  ],
};
