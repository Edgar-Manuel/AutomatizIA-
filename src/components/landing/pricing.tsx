"use client";

import { useEffect, useRef, useState } from "react";
import { PLANS, type Plan } from "./data";
import { IconArrowRight, IconCheck, IconSparkles } from "./icons";

function BillingToggle({
  yearly,
  setYearly,
}: {
  yearly: boolean;
  setYearly: (v: boolean) => void;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative inline-flex p-1 rounded-full bg-white border border-ink-200 shadow-soft">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={`relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors ${
            !yearly ? "text-white" : "text-ink-700"
          }`}
        >
          Mensual
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={`relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors inline-flex items-center gap-2 ${
            yearly ? "text-white" : "text-ink-700"
          }`}
        >
          Anual
        </button>
        <span
          className="absolute top-1 bottom-1 rounded-full bg-ink-900 transition-all duration-300 ease-out"
          style={{
            left: yearly ? "calc(50% + 2px)" : 4,
            right: yearly ? 4 : "calc(50% + 2px)",
          }}
        />
      </div>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mint-50 text-mint-500 border border-mint-100 text-[11.5px] font-medium">
        <IconSparkles size={11} />2 meses gratis en anual
      </span>
    </div>
  );
}

function PriceCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.yearly : plan.monthly;
  const isRec = !!plan.recommended;
  const savings = (plan.monthly - plan.yearly) * 12;
  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-7 flex flex-col h-full transition-colors ${
        isRec
          ? "bg-ink-900 text-white border-2 border-ink-900 shadow-pop"
          : "bg-white border border-ink-200"
      }`}
    >
      {isRec && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral text-white text-[11px] font-semibold tracking-wide uppercase">
          <IconSparkles size={11} /> Recomendado
        </div>
      )}
      <div className="flex items-baseline justify-between">
        <h3
          className={`text-[20px] font-semibold tracking-tight ${isRec ? "text-white" : "text-ink-900"}`}
        >
          {plan.name}
        </h3>
        {yearly && (
          <span
            className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full ${
              isRec ? "bg-white/15 text-white" : "bg-mint-50 text-mint-500 border border-mint-100"
            }`}
          >
            Ahorra {savings}€
          </span>
        )}
      </div>
      <p
        className={`mt-1.5 text-[13.5px] leading-relaxed ${isRec ? "text-white/70" : "text-ink-500"}`}
      >
        {plan.pitch}
      </p>

      <div className="mt-5 flex items-end gap-1.5">
        <span
          className={`text-[48px] leading-none font-bold tracking-[-0.03em] num-tab ${
            isRec ? "text-white" : "text-ink-900"
          }`}
        >
          {price}€
        </span>
        <span className={`pb-1.5 text-[13px] ${isRec ? "text-white/70" : "text-ink-500"}`}>
          / mes
        </span>
      </div>
      <div className={`mt-1 text-[11.5px] ${isRec ? "text-white/60" : "text-ink-400"}`}>
        {yearly ? (
          <>Facturado {(plan.yearly * 12).toLocaleString("es-ES")}€/año · IVA no incluido</>
        ) : (
          <>Facturado mensualmente · IVA no incluido</>
        )}
      </div>

      <div
        className={`mt-5 rounded-xl p-3 ${isRec ? "bg-white/10" : "bg-ink-50 border border-ink-100"}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[11.5px] uppercase tracking-wider ${isRec ? "text-white/60" : "text-ink-500"}`}
          >
            Créditos al mes
          </span>
          <span
            className={`text-[16px] font-semibold num-tab ${isRec ? "text-white" : "text-ink-900"}`}
          >
            {plan.credits.toLocaleString("es-ES")}
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
            <span
              className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                isRec ? "bg-white/15" : "bg-mint-100"
              }`}
            >
              <IconCheck size={10} stroke={3} className={isRec ? "text-white" : "text-mint-500"} />
            </span>
            <span className={isRec ? "text-white/90" : "text-ink-700"}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`mt-6 w-full py-3 rounded-xl text-[14px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
          isRec ? "bg-white text-ink-900 hover:bg-ink-50" : "bg-ink-900 text-white hover:bg-ink-700"
        }`}
      >
        {plan.cta} <IconArrowRight size={14} stroke={2} />
      </button>
    </div>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  const swipeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = swipeRef.current;
    if (!el) return;
    const rec = el.querySelector<HTMLElement>('[data-recommended="true"]');
    if (rec) {
      const left = rec.offsetLeft - (el.clientWidth - rec.clientWidth) / 2;
      el.scrollTo({ left, behavior: "auto" });
    }
  }, []);

  return (
    <section id="precios" className="py-20 sm:py-28 bg-white border-y border-ink-200">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">Precios</div>
            <h2 className="mt-2 text-[34px] sm:text-[42px] tracking-[-0.02em] leading-[1.05] font-bold text-ink-900">
              Cobramos por uso, no por usuario.
            </h2>
            <p className="mt-4 text-[16px] text-ink-500 leading-relaxed">
              Sin permanencia, sin sorpresas en la factura, sin cargos por integración.
            </p>
          </div>
          <BillingToggle yearly={yearly} setYearly={setYearly} />
        </div>

        <div className="mt-10 hidden md:grid grid-cols-3 gap-5 items-stretch">
          {PLANS.map((p) => (
            <PriceCard key={p.id} plan={p} yearly={yearly} />
          ))}
        </div>

        <div className="mt-10 md:hidden -mx-5 px-5">
          <div
            ref={swipeRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 snap-x-pad"
          >
            {PLANS.map((p) => (
              <div
                key={p.id}
                data-recommended={p.recommended ? "true" : "false"}
                className="shrink-0 w-[85%] max-w-[340px]"
              >
                <PriceCard plan={p} yearly={yearly} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-2">
            {PLANS.map((p) => (
              <span
                key={p.id}
                className={`h-1.5 rounded-full ${p.recommended ? "bg-ink-900 w-6" : "bg-ink-200 w-1.5"}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-[12.5px] text-ink-400">
          ¿Mueves más de 4.000 ejecuciones al mes? Te hacemos un plan a medida.{" "}
          <a href="#contacto" className="text-ink-700 hover:underline">
            Hablar con ventas →
          </a>
        </p>
      </div>
    </section>
  );
}
