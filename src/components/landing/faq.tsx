"use client";

import { useState } from "react";
import { FAQS } from "./data";
import { IconChevDown } from "./icons";

function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`border-b border-ink-200 ${open ? "bg-paper" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left py-5 px-1 flex items-center justify-between gap-6 group"
        aria-expanded={open}
      >
        <span
          className={`text-[16px] sm:text-[17px] font-medium tracking-tight ${
            open ? "text-ink-900" : "text-ink-900 group-hover:text-ink-700"
          }`}
        >
          {q}
        </span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
            open ? "bg-ink-900 text-white border-ink-900 rotate-180" : "border-ink-200 text-ink-700"
          }`}
        >
          <IconChevDown size={14} stroke={2.2} />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-12 px-1 text-[14.5px] leading-[1.6] text-ink-500">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-[840px] mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-[12px] uppercase tracking-[0.16em] text-ink-400">
            Preguntas frecuentes
          </div>
          <h2 className="mt-2 text-[34px] sm:text-[42px] tracking-[-0.02em] leading-[1.05] font-bold text-ink-900">
            Lo que nos preguntan en la primera llamada.
          </h2>
        </div>
        <div className="mt-10 border-t border-ink-200">
          {FAQS.map((f, i) => (
            <FAQItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
        <div className="mt-10 text-center text-[13.5px] text-ink-500">
          ¿Otra pregunta?{" "}
          <a
            href="#contacto"
            className="text-ink-900 font-medium underline-offset-4 hover:underline"
          >
            Escríbenos a hola@automatizia.es
          </a>
        </div>
      </div>
    </section>
  );
}
