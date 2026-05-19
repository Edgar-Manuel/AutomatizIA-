import { DEPARTMENTS } from "./data";
import { IconArrowRight } from "./icons";

export function DepartmentStrip() {
  return (
    <section className="border-y border-ink-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-7">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">
              Por departamento
            </div>
            <h2 className="mt-1 text-[20px] sm:text-[22px] font-semibold text-ink-900 tracking-tight">
              Un agente para cada cosa que ya haces a mano.
            </h2>
          </div>
          <a
            href="#agentes"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] text-brand-700 hover:underline whitespace-nowrap mt-1.5"
          >
            Ver los 50 agentes <IconArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {DEPARTMENTS.map((d) => (
            <a
              key={d.id}
              href="#agentes"
              className="group rounded-xl border border-ink-200 bg-paper hover:border-brand hover:bg-brand-50/40 transition-colors px-3 py-3.5 flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-lg bg-white border border-ink-200 flex items-center justify-center text-ink-700 group-hover:text-brand-700 group-hover:border-brand-100 transition-colors">
                <d.Icon size={17} />
              </span>
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium text-ink-900 leading-tight truncate">
                  {d.name}
                </div>
                <div className="text-[11.5px] text-ink-500 mt-0.5 num-tab">{d.count} agentes</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
