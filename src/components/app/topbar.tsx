import Link from "next/link";
import { IconBell, IconCoin } from "@/components/landing/icons";
import { signOutAction } from "@/server/actions/sign-out";

type Props = {
  email: string;
  organizationName: string;
  balance: number;
};

function initialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "?";
  return local.slice(0, 2).toUpperCase();
}

export function Topbar({ email, organizationName, balance }: Props) {
  return (
    <header className="sticky top-0 z-30 h-16 px-5 sm:px-7 flex items-center justify-between bg-paper/80 backdrop-blur-md border-b border-ink-200">
      <div className="min-w-0">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Organización</div>
        <div className="text-[14px] font-medium text-ink-900 truncate">{organizationName}</div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/app/billing"
          className="hidden sm:inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-900 bg-white border border-ink-200 px-3 py-1.5 rounded-full hover:border-ink-300 transition-colors"
        >
          <IconCoin size={13} className="text-brand" />
          <span className="num-tab">{balance}</span>
          <span className="text-ink-500">créditos</span>
        </Link>

        <button
          type="button"
          aria-label="Notificaciones"
          className="hidden sm:inline-flex w-9 h-9 rounded-full bg-white border border-ink-200 items-center justify-center text-ink-700 hover:border-ink-300 transition-colors"
        >
          <IconBell size={15} />
        </button>

        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white transition-colors"
            title="Cerrar sesión"
          >
            <span className="w-8 h-8 rounded-full mark text-white flex items-center justify-center text-[12px] font-semibold">
              {initialsFromEmail(email)}
            </span>
            <span className="hidden md:inline text-[13px] text-ink-700">Salir</span>
          </button>
        </form>
      </div>
    </header>
  );
}
