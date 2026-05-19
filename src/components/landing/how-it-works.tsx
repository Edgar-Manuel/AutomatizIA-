import {
  IconBolt,
  IconCheck,
  IconChevDown,
  IconCopy,
  IconRepeat,
  IconReview,
  IconSearch,
  IconSparkles,
  IconStar,
} from "./icons";

function StepBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-ink-900 text-white text-[12px] font-semibold inline-flex items-center justify-center">
        {n}
      </span>
      <span className="text-[12px] uppercase tracking-[0.14em] text-ink-500">{label}</span>
    </div>
  );
}

function StepFrame({ children, label = "" }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="rounded-xl bg-white border border-ink-200 shadow-soft overflow-hidden">
      <div className="h-7 flex items-center gap-1.5 px-3 border-b border-ink-100 bg-ink-50/60">
        <span className="w-2 h-2 rounded-full bg-ink-200" />
        <span className="w-2 h-2 rounded-full bg-ink-200" />
        <span className="w-2 h-2 rounded-full bg-ink-200" />
        {label ? (
          <span className="ml-2 text-[10.5px] text-ink-400 font-mono truncate">{label}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function FormRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 first:mt-0">
      <div className="text-[10.5px] text-ink-500 mb-1 flex items-center gap-1">
        {label}
        {required && <span className="text-coral">*</span>}
      </div>
      <div className="rounded-md border border-ink-100 bg-ink-50/50 px-2.5 py-1.5 min-h-[28px] flex items-center">
        {children}
      </div>
    </div>
  );
}

function Select({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[12px] text-ink-700 w-full">
      <span>{value}</span>
      <IconChevDown size={12} className="text-ink-400" />
    </div>
  );
}

const SEARCH_RESULTS = [
  { name: "Generador de respuestas a reseñas Google", dept: "Atención Cliente", match: true },
  { name: "Respuestas a reseñas TripAdvisor", dept: "Atención Cliente", match: false },
  { name: "Respuestas a reseñas Booking", dept: "Hostelería", match: false },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">Cómo funciona</div>
          <h2 className="mt-2 text-[34px] sm:text-[42px] tracking-[-0.02em] leading-[1.05] font-bold text-ink-900">
            Tres pasos. El último es copiar y pegar.
          </h2>
          <p className="mt-4 text-[16px] text-ink-500 leading-relaxed">
            Te lo enseñamos con el agente más popular:{" "}
            <span className="text-ink-900 font-medium">
              Generador de respuestas a reseñas Google.
            </span>
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          <article className="space-y-4">
            <StepBadge n={1} label="Elige un agente" />
            <h3 className="text-[20px] font-semibold text-ink-900 tracking-tight">
              Busca por departamento o por lo que quieras hacer.
            </h3>
            <p className="text-[14.5px] text-ink-500 leading-relaxed">
              50 agentes organizados por área. Si no sabes cuál usar, escribes lo que necesitas y la
              búsqueda te propone tres.
            </p>
            <StepFrame label="app.automatizia.es / agentes">
              <div className="p-3.5">
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-ink-50 border border-ink-100 text-[12.5px] text-ink-700">
                  <IconSearch size={14} className="text-ink-400" />
                  responder reseñas
                  <span className="caret" />
                </div>
                <div className="mt-3 space-y-1.5">
                  {SEARCH_RESULTS.map((r) => (
                    <button
                      type="button"
                      key={r.name}
                      className={`w-full text-left flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${
                        r.match
                          ? "border-brand-100 bg-brand-50 ring-1 ring-brand-100"
                          : "border-ink-100 hover:bg-ink-50"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          r.match
                            ? "bg-white text-brand-700 border border-brand-100"
                            : "bg-ink-50 text-ink-500 border border-ink-100"
                        }`}
                      >
                        <IconReview size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px] font-medium text-ink-900 truncate">
                          {r.name}
                        </span>
                        <span className="block text-[11px] text-ink-400">{r.dept}</span>
                      </span>
                      {r.match && (
                        <span className="ml-auto text-[10.5px] text-brand-700 font-medium bg-white px-1.5 py-0.5 rounded-md border border-brand-100">
                          Más usado
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </StepFrame>
          </article>

          <article className="space-y-4">
            <StepBadge n={2} label="Rellena el formulario" />
            <h3 className="text-[20px] font-semibold text-ink-900 tracking-tight">
              Le das contexto en menos de un minuto.
            </h3>
            <p className="text-[14.5px] text-ink-500 leading-relaxed">
              Pegas la reseña, eliges tono e idioma y dices a quién representas. Nada de prompts.
            </p>
            <StepFrame label="agentes / respuestas-resenas / nuevo">
              <div className="p-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-mint-100 text-mint-500 inline-flex items-center justify-center">
                    <IconReview size={14} />
                  </span>
                  <span className="text-[13px] font-semibold text-ink-900">
                    Respuestas a reseñas Google
                  </span>
                </div>
                <FormRow label="Reseña original" required>
                  <span className="text-[12px] text-ink-700">
                    &ldquo;Llevo años yendo y el trato es excelente, pero la última visita esperé 40
                    minutos...&rdquo;
                  </span>
                </FormRow>
                <FormRow label="Estrellas">
                  <div className="flex items-center gap-0.5 text-coral">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <IconStar
                        key={i}
                        size={13}
                        className={i <= 4 ? "fill-current" : "text-ink-300"}
                      />
                    ))}
                  </div>
                </FormRow>
                <div className="grid grid-cols-2 gap-2">
                  <FormRow label="Tono">
                    <Select value="Cercano, profesional" />
                  </FormRow>
                  <FormRow label="Idioma">
                    <Select value="Español" />
                  </FormRow>
                </div>
                <FormRow label="Nombre del negocio">
                  <span className="text-[12px] text-ink-700">Clínica Dental Ríos</span>
                </FormRow>
                <button
                  type="button"
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 text-[13px] font-medium bg-ink-900 text-white rounded-lg py-2 hover:bg-ink-700"
                >
                  <IconBolt size={13} stroke={2} /> Ejecutar · 1 crédito
                </button>
              </div>
            </StepFrame>
          </article>

          <article className="space-y-4">
            <StepBadge n={3} label="Copia el resultado" />
            <h3 className="text-[20px] font-semibold text-ink-900 tracking-tight">
              Lo tienes en 6 segundos, listo para pegar.
            </h3>
            <p className="text-[14.5px] text-ink-500 leading-relaxed">
              Si no te convence, regenera. Si te gusta, guardas la plantilla y la próxima reseña la
              respondes en dos clics.
            </p>
            <StepFrame label="resultado · 5,8s · 1 crédito">
              <div className="p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                    <IconSparkles size={11} /> Respuesta generada
                  </span>
                  <span className="text-[10.5px] inline-flex items-center gap-1 text-mint-500">
                    <IconCheck size={11} stroke={2.5} /> Listo
                  </span>
                </div>
                <div className="rounded-lg bg-brand-50/70 border border-brand-100 p-3 text-[12.5px] text-ink-900 leading-relaxed">
                  <p>Hola Carlos, gracias por seguir confiando en nosotros todos estos años.</p>
                  <p className="mt-2">
                    Lamentamos mucho la espera de tu última visita: ese día tuvimos una urgencia que
                    nos descuadró la agenda y deberíamos haberte avisado.
                  </p>
                  <p className="mt-2">
                    Si te animas a contárnoslo, nos encantaría compensarte la próxima cita. Un
                    saludo del equipo.
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className="text-[12px] py-2 rounded-lg border border-ink-200 hover:border-ink-300 inline-flex items-center justify-center gap-1.5 text-ink-700"
                  >
                    <IconRepeat size={12} /> Regenerar
                  </button>
                  <button
                    type="button"
                    className="text-[12px] py-2 rounded-lg border border-ink-200 hover:border-ink-300 inline-flex items-center justify-center gap-1.5 text-ink-700"
                  >
                    <IconCheck size={12} stroke={2} /> Guardar
                  </button>
                  <button
                    type="button"
                    className="text-[12px] py-2 rounded-lg bg-ink-900 text-white inline-flex items-center justify-center gap-1.5"
                  >
                    <IconCopy size={12} /> Copiar
                  </button>
                </div>
              </div>
            </StepFrame>
          </article>
        </div>
      </div>
    </section>
  );
}
