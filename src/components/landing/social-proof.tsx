import { TESTIMONIALS, type Testimonial } from "./data";

function Avatar({ bg, initials, size = 44 }: { bg: string; initials: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="rounded-2xl bg-paper border border-ink-200 p-6 flex flex-col h-full">
      <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-ink-200 text-[11.5px] text-ink-700">
        <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
        {t.metric}
      </div>
      <blockquote className="mt-4 text-[16px] leading-[1.55] text-ink-900 flex-1">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 pt-5 border-t border-ink-100 flex items-center gap-3">
        <Avatar bg={t.avatarBg} initials={t.initials} />
        <div className="min-w-0">
          <div className="text-[13.5px] font-semibold text-ink-900 truncate">{t.name}</div>
          <div className="text-[12px] text-ink-500 truncate">
            {t.role} · {t.company}
          </div>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <div className="text-[10.5px] uppercase tracking-wider text-ink-400">Usa</div>
          <div className="text-[11.5px] text-ink-700 leading-tight">{t.agent}</div>
        </div>
      </figcaption>
    </figure>
  );
}

const NUMBERS: Array<[string, string]> = [
  ["4.300+", "PYMEs activas"],
  ["1,2 M", "Tareas ejecutadas"],
  ["5,4 s", "Tiempo medio por ejecución"],
  ["97%", "Renovaciones mensuales"],
];

export function SocialProof() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">
            Lo que cuentan quienes los usan
          </div>
          <h2 className="mt-2 text-[34px] sm:text-[42px] tracking-[-0.02em] leading-[1.05] font-bold text-ink-900">
            Tres negocios, tres horas que se recuperan.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-ink-200 rounded-2xl overflow-hidden border border-ink-200">
          {NUMBERS.map(([n, l]) => (
            <div key={l} className="bg-paper p-5">
              <div className="text-[28px] font-bold text-ink-900 tracking-tight num-tab">{n}</div>
              <div className="text-[12.5px] text-ink-500 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
