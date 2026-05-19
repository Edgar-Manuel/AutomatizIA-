import Link from "next/link";
import { DEPARTMENTS } from "@/components/landing/data";
import { IconCoin, IconSearch } from "@/components/landing/icons";
import { Logo } from "@/components/landing/logo";

type Props = {
  balance: number;
  monthlyBudget: number;
  activeSlug?: string;
};

export function Sidebar({ balance, monthlyBudget, activeSlug }: Props) {
  const pct = monthlyBudget > 0 ? Math.min(100, Math.round((balance / monthlyBudget) * 100)) : 0;

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 border-r border-ink-200 bg-paper">
      <div className="px-5 h-16 flex items-center border-b border-ink-200">
        <Link href="/app" aria-label="Inicio del panel">
          <Logo />
        </Link>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white border border-ink-200">
          <IconSearch size={14} className="text-ink-400" />
          <span className="text-[12.5px] text-ink-400">Buscar agente...</span>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-400 px-2 mt-1 mb-1.5">
          Departamentos
        </div>
        <ul className="space-y-0.5">
          {DEPARTMENTS.map((d) => {
            const isActive = activeSlug === d.id;
            return (
              <li key={d.id}>
                <Link
                  href="/app"
                  className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-[13px] transition-colors ${
                    isActive
                      ? "bg-brand-100 text-brand-700 font-medium"
                      : "text-ink-700 hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <d.Icon size={15} />
                    <span className="truncate">{d.name}</span>
                  </span>
                  <span
                    className={`text-[10.5px] num-tab ${isActive ? "text-brand-700" : "text-ink-400"}`}
                  >
                    {d.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-ink-200">
        <div className="p-3 rounded-xl border border-dashed border-ink-200 bg-white">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Créditos</div>
          <div className="mt-1 flex items-end gap-1.5">
            <span className="text-[20px] font-bold text-ink-900 num-tab">{balance}</span>
            {monthlyBudget > 0 && (
              <span className="text-[11px] text-ink-400 pb-1 num-tab">/ {monthlyBudget}</span>
            )}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
          </div>
          <Link
            href="/app/billing"
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-900 text-white text-[12px] font-medium hover:bg-ink-700 transition-colors"
          >
            <IconCoin size={12} /> Recargar
          </Link>
        </div>
      </div>
    </aside>
  );
}
