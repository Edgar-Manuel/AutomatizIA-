import type { CatalogAgentConfig } from "@/agents/_factory";
import { ATENCION_CLIENTE_AGENTS } from "./atencion-cliente";
import { FINANZAS_AGENTS } from "./finanzas";
import { MARKETING_AGENTS } from "./marketing";
import { OPERACIONES_AGENTS } from "./operaciones";
import { RRHH_AGENTS } from "./rrhh";
import { VENTAS_AGENTS } from "./ventas";

// The 47 config-driven agents. Together with the 3 hand-written ones
// (google-reviews-responder, cold-email-writer, instagram-copy-generator)
// they form the 50-agent catalog: ventas 11, marketing 9, atención cliente 8,
// operaciones 7, rrhh 8, finanzas 7.
export const CATALOG: CatalogAgentConfig[] = [
  ...VENTAS_AGENTS,
  ...MARKETING_AGENTS,
  ...ATENCION_CLIENTE_AGENTS,
  ...OPERACIONES_AGENTS,
  ...RRHH_AGENTS,
  ...FINANZAS_AGENTS,
];
