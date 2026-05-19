import { z } from "zod";

export const TONE_OPTIONS = ["cercano-profesional", "formal", "directo", "calido"] as const;
export type Tone = (typeof TONE_OPTIONS)[number];

export const TONE_LABELS: Record<Tone, string> = {
  "cercano-profesional": "Cercano y profesional",
  formal: "Formal",
  directo: "Directo al grano",
  calido: "Cálido y empático",
};

export const inputSchema = z.object({
  review: z
    .string()
    .min(15, "Pega la reseña completa, al menos 15 caracteres.")
    .max(2000, "La reseña es demasiado larga (máximo 2000 caracteres)."),
  rating: z.coerce.number().int().min(1).max(5),
  reviewerName: z
    .string()
    .min(1, "Indica el nombre o iniciales del cliente.")
    .max(80)
    .optional()
    .or(z.literal("")),
  businessName: z.string().min(2, "Indica el nombre del negocio.").max(80),
  tone: z.enum(TONE_OPTIONS).default("cercano-profesional"),
});

export type ReviewInput = z.infer<typeof inputSchema>;

export const outputSchema = z.object({
  variants: z
    .array(
      z.object({
        label: z.string(),
        text: z.string().min(20),
      }),
    )
    .length(3),
});

export type ReviewOutput = z.infer<typeof outputSchema>;
