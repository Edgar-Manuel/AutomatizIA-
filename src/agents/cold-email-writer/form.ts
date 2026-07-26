import type { AgentFormSpec } from "@/agents/_form";
import { OBJECTIVE_LABELS, OBJECTIVE_OPTIONS } from "./schemas";

export const formSpec: AgentFormSpec = {
  resultNote:
    "Cuéntanos qué vendes y a quién, y pulsa Ejecutar. Te devuelve una secuencia de 3 emails lista para enviar.",
  expectedVariants: 3,
  fields: [
    {
      name: "product",
      label: "Qué vendes",
      type: "textarea",
      required: true,
      hint: "Producto o servicio y el problema que resuelve, en tus palabras.",
      placeholder: "Software de gestión de turnos para clínicas: reduce los huecos de agenda...",
      rows: 4,
      minLength: 10,
      maxLength: 600,
    },
    {
      name: "companyName",
      label: "Tu empresa",
      type: "text",
      required: true,
      maxLength: 80,
      placeholder: "TurnosPro",
    },
    {
      name: "leadCompany",
      label: "Empresa del lead",
      type: "text",
      required: true,
      maxLength: 80,
      placeholder: "Clínica Dental Ríos",
    },
    {
      name: "leadName",
      label: "Nombre del lead (opcional)",
      type: "text",
      maxLength: 80,
      placeholder: "Marta",
    },
    {
      name: "objective",
      label: "Objetivo",
      type: "select",
      required: true,
      defaultValue: "agendar-reunion",
      options: OBJECTIVE_OPTIONS.map((o) => ({ value: o, label: OBJECTIVE_LABELS[o] })),
    },
    {
      name: "leadContext",
      label: "Contexto del lead (opcional)",
      type: "textarea",
      hint: "Algo que sepas de ellos: tamaño, sector, una noticia reciente...",
      placeholder: "Acaban de abrir una segunda clínica en Valencia.",
      rows: 3,
      maxLength: 400,
    },
  ],
};
