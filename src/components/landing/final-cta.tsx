import { IconArrowRight, IconCheck } from "./icons";

export function FinalCTA() {
  return (
    <section id="start" className="px-5 sm:px-8 pb-20 sm:pb-28">
      <div className="max-w-[1200px] mx-auto rounded-3xl bg-ink-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute -top-32 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(closest-side, rgba(121,105,239,.45), rgba(121,105,239,0))",
          }}
        />

        <div className="relative px-6 sm:px-14 py-16 sm:py-24 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[12px] text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
            20 créditos de regalo · sin tarjeta
          </div>
          <h2 className="mt-5 text-[40px] sm:text-[56px] tracking-[-0.025em] leading-[1.02] font-bold">
            Que la IA trabaje en tu PYME <span className="text-brand-500">esta semana.</span>
          </h2>
          <p className="mt-5 text-[16.5px] sm:text-[18px] text-white/70 leading-[1.55] max-w-xl mx-auto">
            Te llevas 20 créditos para probar los agentes que quieras. Sin tarjeta, sin demo
            agendada, sin formularios de cinco páginas.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-ink-900 font-semibold text-[16px] hover:bg-ink-50 transition-colors"
            >
              Empieza gratis, 20 créditos de regalo
              <IconArrowRight size={16} stroke={2.2} />
            </a>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <IconCheck size={13} stroke={2.2} className="text-mint-500" /> Sin permanencia
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconCheck size={13} stroke={2.2} className="text-mint-500" /> Datos en UE
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconCheck size={13} stroke={2.2} className="text-mint-500" /> Configuración en 3
              minutos
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
