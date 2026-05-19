import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/landing/logo";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex flex-col">
      <div className="px-5 sm:px-8 py-5">
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-ink-900 leading-tight">
            Entra en tu cuenta
          </h1>
          <p className="mt-2 text-[14.5px] text-ink-500">
            Accede al panel y a los agentes que ya tengas configurados.
          </p>
          <div className="mt-8">
            <AuthForm mode="login" />
          </div>
          <p className="mt-6 text-[13.5px] text-ink-500">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/signup" className="text-ink-900 font-medium hover:underline">
              Crea una en 30 segundos
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
