import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/landing/logo";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <main className="min-h-dvh flex flex-col">
      <div className="px-5 sm:px-8 py-5">
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-md">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-ink-200 text-[12px] text-ink-700 shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
            20 créditos de regalo, sin tarjeta
          </div>
          <h1 className="mt-4 text-[28px] sm:text-[32px] font-bold tracking-tight text-ink-900 leading-tight">
            Crea tu cuenta gratis
          </h1>
          <p className="mt-2 text-[14.5px] text-ink-500">
            En menos de un minuto tienes acceso al catálogo de agentes y créditos para probar.
          </p>
          <div className="mt-8">
            <AuthForm mode="signup" />
          </div>
          <p className="mt-6 text-[13.5px] text-ink-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-ink-900 font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
