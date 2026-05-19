import Link from "next/link";
import { DEPARTMENTS } from "./data";
import {
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconClock,
  IconCoin,
  IconCopy,
  IconPlay,
  IconReview,
  IconSearch,
  IconShield,
  IconSparkles,
  IconStar,
} from "./icons";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-2.5 first:mt-0">
      <div className="text-[10.5px] text-ink-500 mb-1">{label}</div>
      <div className="rounded-lg border border-ink-100 bg-ink-50/60 px-2.5 py-1.5">{children}</div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div className="relative w-full select-none">
      <div className="rounded-[18px] bg-white border border-ink-200 shadow-card overflow-hidden">
        <div className="h-9 px-3.5 flex items-center gap-2 border-b border-ink-100 bg-ink-50/70">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff6058]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbe2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2bca41]" />
          <div className="flex-1 flex justify-center">
            <div className="text-[11px] text-ink-400 font-mono px-2 py-0.5 rounded-md bg-white border border-ink-100">
              app.automatizia.es / agentes / respuestas-resenas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[180px_1fr] min-h-[440px]">
          <aside className="border-r border-ink-100 bg-ink-50/40 p-3">
            <div className="flex items-center gap-2 px-2 py-2 mb-2 rounded-lg bg-white border border-ink-100">
              <IconSearch size={14} className="text-ink-400" />
              <span className="text-[12px] text-ink-400">Buscar agente…</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-ink-400 px-2 mt-3 mb-1">
              Departamentos
            </div>
            <ul className="space-y-0.5">
              {DEPARTMENTS.map((d) => {
                const active = d.id === "soporte";
                return (
                  <li key={d.id}>
                    <div
                      className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-[12.5px] ${
                        active
                          ? "bg-brand-100 text-brand-700 font-medium"
                          : "text-ink-700 hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <d.Icon size={14} />
                        <span className="truncate">{d.name}</span>
                      </span>
                      <span
                        className={`text-[10.5px] num-tab ${active ? "text-brand-700" : "text-ink-400"}`}
                      >
                        {d.count}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 mx-1 p-2.5 rounded-xl border border-dashed border-ink-200 bg-white">
              <div className="text-[10.5px] text-ink-500">Créditos restantes</div>
              <div className="flex items-end gap-1.5 mt-1">
                <span className="text-[15px] font-semibold text-ink-900 num-tab">847</span>
                <span className="text-[10px] text-ink-400 pb-0.5">/ 1.000</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                <div className="h-full bg-brand" style={{ width: "84%" }} />
              </div>
            </div>
          </aside>

          <main className="p-4 sm:p-5">
            <div className="flex items-center gap-1.5 text-[11.5px] text-ink-400 mb-2.5">
              <span>Atención Cliente</span>
              <span>›</span>
              <span className="text-ink-700">Respuestas a reseñas Google</span>
            </div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-mint-100 text-mint-500">
                    <IconReview size={15} />
                  </span>
                  <h3 className="text-[15px] font-semibold text-ink-900">
                    Respuestas a reseñas Google
                  </h3>
                </div>
                <div className="mt-1 text-[11.5px] text-ink-500 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <IconCoin size={11} /> 1 crédito
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IconClock size={11} /> ~6s
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-[12px] font-medium inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900 text-white hover:bg-ink-700"
              >
                <IconBolt size={12} stroke={2} /> Ejecutar
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-3.5">
              <div className="rounded-xl border border-ink-100 bg-white p-3.5">
                <div className="text-[10.5px] uppercase tracking-wider text-ink-400 mb-2">
                  Formulario
                </div>
                <FormField label="Reseña del cliente">
                  <div className="text-[12px] leading-relaxed text-ink-700">
                    &ldquo;Llevo años yendo y el trato es excelente, pero la última visita esperé 40
                    minutos. Por lo demás, todo perfecto.&rdquo;
                    <div className="mt-1 flex items-center gap-0.5 text-coral">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <IconStar
                          key={i}
                          size={12}
                          className={i <= 4 ? "fill-current" : "text-ink-300"}
                        />
                      ))}
                      <span className="ml-1 text-[10.5px] text-ink-400">4/5 · Carlos M.</span>
                    </div>
                  </div>
                </FormField>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <FormField label="Tono">
                    <span className="text-[11.5px] text-ink-700">Cercano, profesional</span>
                  </FormField>
                  <FormField label="Idioma">
                    <span className="text-[11.5px] text-ink-700">Español</span>
                  </FormField>
                </div>
                <FormField label="Nombre del negocio">
                  <span className="text-[11.5px] text-ink-700">Clínica Dental Ríos</span>
                </FormField>
              </div>

              <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10.5px] uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                    <IconSparkles size={11} /> Resultado
                  </div>
                  <button
                    type="button"
                    className="text-[10.5px] text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
                  >
                    <IconCopy size={11} /> Copiar
                  </button>
                </div>
                <div className="text-[12.5px] leading-relaxed text-ink-900 min-h-[160px]">
                  <p className="typeflow">
                    Hola Carlos, gracias por seguir confiando en nosotros todos estos años.
                  </p>
                  <p className="mt-2 typeflow" style={{ animationDelay: "1.2s" }}>
                    Lamentamos mucho la espera de tu última visita: ese día tuvimos una urgencia que
                    nos descuadró la agenda y deberíamos haberte avisado.
                  </p>
                  <p className="mt-2 typeflow" style={{ animationDelay: "2.6s" }}>
                    Si te animas a contárnoslo, nos encantaría compensarte la próxima cita. Un
                    saludo del equipo.
                    <span className="caret" />
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-brand-100 pt-2.5">
                  <div className="text-[10.5px] text-ink-500 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-mint-500">
                      <IconCheck size={11} stroke={2.5} /> Listo en 5,8s
                    </span>
                    <span>·</span>
                    <span>1 crédito usado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="text-[10.5px] px-2 py-1 rounded-md hover:bg-white text-ink-500"
                    >
                      Regenerar
                    </button>
                    <button
                      type="button"
                      className="text-[10.5px] px-2 py-1 rounded-md bg-white border border-ink-100 text-ink-900 font-medium"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="hidden md:flex absolute -left-7 top-1/3 items-center gap-2 px-3 py-2 bg-white border border-ink-200 rounded-xl shadow-soft text-[11.5px] text-ink-700 -rotate-3">
        <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
        50 agentes activos
      </div>
      <div className="hidden md:flex absolute -right-6 bottom-10 items-center gap-2 px-3 py-2 bg-white border border-ink-200 rounded-xl shadow-soft text-[11.5px] text-ink-700 rotate-2">
        <IconShield size={12} className="text-mint-500" />
        Datos en servidores UE
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[600px] grad-violet pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-ink-200 text-[12px] text-ink-700 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
              Plataforma de agentes IA para PYMEs
            </div>
            <h1 className="mt-4 text-[40px] sm:text-[54px] leading-[1.04] tracking-[-0.025em] font-bold text-ink-900">
              50 agentes de IA que trabajan en tu PYME{" "}
              <span className="relative inline-block">
                <span className="relative z-10">desde el primer día.</span>
                <span className="absolute left-0 right-0 bottom-1 h-3 bg-brand-100 -z-0 rounded-sm" />
              </span>
            </h1>
            <p className="mt-5 text-[17px] leading-[1.55] text-ink-500">
              Ventas, marketing, atención al cliente, operaciones, RRHH y finanzas. Abres uno,
              rellenas un formulario, tienes el resultado. Sin prompts ni configuración.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-medium text-[14.5px] shadow-pop hover:bg-brand-700 transition-colors"
              >
                Empezar gratis
                <IconArrowRight size={16} stroke={2} />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-ink-200 text-ink-900 font-medium text-[14.5px] hover:border-ink-300 transition-colors"
              >
                <IconPlay size={12} />
                Ver agentes en acción
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <IconCheck size={14} className="text-mint-500" stroke={2.4} /> 20 créditos de regalo
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheck size={14} className="text-mint-500" stroke={2.4} /> Sin tarjeta
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheck size={14} className="text-mint-500" stroke={2.4} /> En español
              </span>
            </div>
          </div>

          <div className="lg:pl-4">
            <DashboardMock />
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="text-center text-[12px] uppercase tracking-[0.16em] text-ink-400">
            Usado por más de 4.300 PYMEs en España y Latinoamérica
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-9 gap-y-4 opacity-80">
            {[
              "Clínica Ríos",
              "Logística Cantábrica",
              "Distribuciones Alba",
              "Hostelera Mar",
              "Bufete Vega",
              "Talleres Quintana",
            ].map((n) => (
              <span key={n} className="text-ink-400 font-medium tracking-tight text-[14.5px]">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
