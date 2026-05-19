"use client";

import { useEffect, useState } from "react";
import { IconArrowRight, IconClose, IconMenu } from "./icons";
import { Logo } from "./logo";

const LINKS: Array<[string, string]> = [
  ["Agentes", "#agentes"],
  ["Cómo funciona", "#como-funciona"],
  ["Precios", "#precios"],
  ["FAQ", "#faq"],
];

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Cerrar menú"
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-paper border-l border-ink-200 p-6 flex flex-col">
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-ink-700"
            aria-label="Cerrar"
          >
            <IconClose />
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-1 text-[16px]">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} onClick={onClose} className="py-2.5 text-ink-900">
              {l}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <a
            href="#login"
            className="text-center py-3 rounded-xl border border-ink-200 text-[14px] font-medium"
          >
            Entrar
          </a>
          <a
            href="#start"
            className="text-center py-3 rounded-xl bg-ink-900 text-white text-[14px] font-medium inline-flex items-center justify-center gap-1.5"
          >
            Empezar gratis <IconArrowRight size={14} stroke={2} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all ${
          scrolled
            ? "backdrop-blur-md bg-paper/80 border-b border-ink-200/70"
            : "border-b border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-[14px] text-ink-700">
            {LINKS.map(([l, h]) => (
              <a key={h} href={h} className="hover:text-ink-900">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#login"
              className="hidden sm:inline-flex text-[14px] text-ink-700 hover:text-ink-900 px-3 py-2 rounded-lg"
            >
              Entrar
            </a>
            <a
              href="#start"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium bg-ink-900 text-white px-3.5 py-2 rounded-lg hover:bg-ink-700 transition-colors"
            >
              Empezar gratis
              <IconArrowRight size={14} stroke={2} />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 -mr-2 text-ink-700"
              aria-label="Menú"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
