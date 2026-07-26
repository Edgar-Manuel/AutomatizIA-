import { z } from "zod";

export const OBJECTIVE_OPTIONS = [
  "agendar-reunion",
  "conseguir-respuesta",
  "presentar-demo",
] as const;
export type Objective = (typeof OBJECTIVE_OPTIONS)[number];

export const OBJECTIVE_LABELS: Record<Objective, string> = {
  "agendar-reunion": "Agendar una reunión",
  "conseguir-respuesta": "Conseguir una respuesta",
  "presentar-demo": "Presentar una demo",
};

export const inputSchema = z.object({
  companyName: z.string().min(2, "Indica el nombre de tu empresa.").max(80),
  product: z
    .string()
    .min(10, "Describe qué vendes con al menos 10 caracteres.")
    .max(600, "La descripción es demasiado larga (máximo 600 caracteres)."),
  leadCompany: z.string().min(2, "Indica la empresa del lead.").max(80),
  leadName: z.string().max(80).optional().or(z.literal("")),
  leadContext: z
    .string()
    .max(400, "El contexto es demasiado largo (máximo 400 caracteres).")
    .optional()
    .or(z.literal("")),
  objective: z.enum(OBJECTIVE_OPTIONS).default("agendar-reunion"),
});

export type ColdEmailInput = z.infer<typeof inputSchema>;

export const outputSchema = z.object({
  variants: z
    .array(
      z.object({
        label: z.string(),
        text: z.string().min(40),
      }),
    )
    .length(3),
});

export type ColdEmailOutput = z.infer<typeof outputSchema>;
