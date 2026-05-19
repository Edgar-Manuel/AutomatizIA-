"use client";

import { useState } from "react";
import { IconGlobe } from "./icons";
import { Logo } from "./logo";

type FooterLink = { label: string; href: string };
const COLS: Array<{ title: string; items: FooterLink[] }> = [
  {
    title: "Producto",
    items: [
      { label: "Agentes", href: "#agentes" },
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Novedades", href: "/novedades" },
      { label: "Estado del servicio", href: "/status" },
    ],
  },
  {
    title: "Precios",
    items: [
      { label: "Planes", href: "#precios" },
      { label: "Bolsas de créditos", href: "/creditos" },
      { label: "Para agencias", href: "/agencias" },
      { label: "Comparar planes", href: "/comparar" },
    ],
  },
  {
    title: "Recursos",
    items: [
      { label: "FAQ", href: "#faq" },
      { label: "Centro de ayuda", href: "/ayuda" },
      { label: "Plantillas", href: "/plantillas" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

const SOCIAL: FooterLink[] = [
  { label: "X", href: "https://x.com/automatizia" },
  { label: "LinkedIn", href: "https://linkedin.com/company/automatizia" },
  { label: "YouTube", href: "https://youtube.com/@automatizia" },
];

const LANG_OPTIONS = [
  { code: "ES", label: "Español", soon: false },
  { code: "EN", label: "English", soon: true },
] as const;

export function Footer() {
  const [lang, setLang] = useState<"ES" | "EN">("ES");

  return (
    <footer className="border-t border-ink-200 bg-paper">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-14">
        <div className="grid lg:grid-cols-[1.3fr_2.5fr] gap-10">
          <div>
            <Logo />
            <p className="mt-4 text-[13.5px] text-ink-500 leading-relaxed max-w-sm">
              50 agentes de IA listos para usar, pensados para PYMEs hispanohablantes. Hecho en
              Madrid · datos en servidores europeos.
            </p>
            <div className="mt-5 inline-flex rounded-lg border border-ink-200 bg-white p-0.5">
              {LANG_OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o.code}
                  onClick={() => !o.soon && setLang(o.code)}
                  className={`text-[12px] px-2.5 py-1.5 rounded-md inline-flex items-center gap-1.5 ${
                    lang === o.code ? "bg-ink-900 text-white" : "text-ink-700"
                  } ${o.soon ? "opacity-60 cursor-not-allowed" : "hover:text-ink-900"}`}
                >
                  <IconGlobe size={12} />
                  {o.label}
                  {o.soon && (
                    <span className="text-[9.5px] uppercase tracking-wider text-ink-400 ml-1">
                      en preparación
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {COLS.map((c) => (
              <div key={c.title}>
                <div className="text-[11.5px] uppercase tracking-[0.14em] text-ink-400">
                  {c.title}
                </div>
                <ul className="mt-3 space-y-2">
                  {c.items.map((i) => (
                    <li key={i.label}>
                      <a href={i.href} className="text-[13.5px] text-ink-700 hover:text-ink-900">
                        {i.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-ink-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-[12px] text-ink-400">
            © 2026 AutomatizIA, S.L. · CIF B-12345678 · Calle Hermosilla 11, Madrid
          </div>
          <div className="flex items-center gap-4 text-[12px] text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
              Todos los sistemas operativos
            </span>
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                rel="noopener noreferrer"
                target="_blank"
                className="hover:text-ink-700"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
