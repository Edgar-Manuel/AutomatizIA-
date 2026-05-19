export class AppError extends Error {
  readonly code: string;
  readonly userMessage: string;
  readonly cta?: { label: string; href: string };

  constructor(opts: {
    code: string;
    userMessage: string;
    message?: string;
    cta?: { label: string; href: string };
  }) {
    super(opts.message ?? opts.userMessage);
    this.code = opts.code;
    this.userMessage = opts.userMessage;
    this.cta = opts.cta;
  }
}

export const InsufficientCredits = (needed: number, available: number) =>
  new AppError({
    code: "insufficient_credits",
    userMessage: `Necesitas ${needed} créditos y tienes ${available}. Recarga para seguir ejecutando agentes.`,
    cta: { label: "Subir de plan", href: "/app/billing" },
  });

export const Unauthorized = () =>
  new AppError({
    code: "unauthorized",
    userMessage: "Inicia sesión para ejecutar este agente.",
    cta: { label: "Entrar", href: "/login" },
  });

export const AgentNotFound = (slug: string) =>
  new AppError({
    code: "agent_not_found",
    userMessage: "Este agente no existe o no está activo.",
    message: `agent_not_found: ${slug}`,
  });

export const InvalidInput = (detail?: string) =>
  new AppError({
    code: "invalid_input",
    userMessage: detail ?? "Revisa los campos del formulario.",
  });

export function translateAnthropicError(err: unknown): AppError {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  if (lower.includes("rate_limit") || lower.includes("429")) {
    return new AppError({
      code: "rate_limited",
      userMessage: "Estamos saturados un momento. Intenta de nuevo en unos segundos.",
      message,
    });
  }
  if (lower.includes("invalid_api_key") || lower.includes("401")) {
    return new AppError({
      code: "ai_misconfigured",
      userMessage: "El servicio de IA no está disponible ahora mismo. Lo estamos revisando.",
      message,
    });
  }
  if (lower.includes("overloaded") || lower.includes("503")) {
    return new AppError({
      code: "ai_overloaded",
      userMessage: "El proveedor de IA está saturado. Vuelve a probar en un momento.",
      message,
    });
  }
  return new AppError({
    code: "ai_failed",
    userMessage: "No pudimos generar la respuesta esta vez. No te hemos descontado créditos.",
    message,
  });
}
