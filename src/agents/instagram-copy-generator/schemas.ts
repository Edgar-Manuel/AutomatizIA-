import { z } from "zod";

export const OBJECTIVE_OPTIONS = [
  "vender",
  "anunciar-novedad",
  "generar-interaccion",
  "educar",
] as const;
export type Objective = (typeof OBJECTIVE_OPTIONS)[number];

export const OBJECTIVE_LABELS: Record<Objective, string> = {
  vender: "Vender un producto o servicio",
  "anunciar-novedad": "Anunciar una novedad",
  "generar-interaccion": "Generar interacción",
  educar: "Educar a la audiencia",
};

export const TONE_OPTIONS = ["cercano", "divertido", "profesional", "inspirador"] as const;
export type Tone = (typeof TONE_OPTIONS)[number];

export const TONE_LABELS: Record<Tone, string> = {
  cercano: "Cercano",
  divertido: "Divertido",
  profesional: "Profesional",
  inspirador: "Inspirador",
};

export const inputSchema = z.object({
  businessName: z.string().min(2, "Indica el nombre del negocio.").max(80),
  topic: z
    .string()
    .min(10, "Describe el tema del post con al menos 10 caracteres.")
    .max(400, "El tema es demasiado largo (máximo 400 caracteres)."),
  objective: z.enum(OBJECTIVE_OPTIONS).default("vender"),
  tone: z.enum(TONE_OPTIONS).default("cercano"),
  extraInfo: z
    .string()
    .max(300, "El detalle extra es demasiado largo (máximo 300 caracteres).")
    .optional()
    .or(z.literal("")),
});

export type InstagramCopyInput = z.infer<typeof inputSchema>;

export const outputSchema = z.object({
  variants: z
    .array(
      z.object({
        label: z.string(),
        text: z.string().min(30),
      }),
    )
    .length(5),
});

export type InstagramCopyOutput = z.infer<typeof outputSchema>;
