"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { IconArrowRight, IconGlobe } from "@/components/landing/icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = { mode: "login" | "signup" };

const GOOGLE_OAUTH_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true";

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      if (mode === "signup") {
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signUpErr) {
          setError(translateAuthError(signUpErr.message));
          return;
        }
        // Local dev: confirmations are disabled, so the user has a session.
        // Cloud with confirmations on: show notice and wait for email.
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          router.replace(next);
          router.refresh();
          return;
        }
        setNotice("Te hemos enviado un email para confirmar la cuenta.");
        return;
      }

      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) {
        setError(translateAuthError(signInErr.message));
        return;
      }
      router.replace(next);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled
        aria-disabled="true"
        title={GOOGLE_OAUTH_ENABLED ? "Continuar con Google" : "Próximamente"}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-ink-200 text-ink-500 text-[14px] font-medium cursor-not-allowed opacity-70"
      >
        <IconGlobe size={14} />
        Continuar con Google
        <span className="text-[10.5px] uppercase tracking-wider text-ink-400 ml-1">
          próximamente
        </span>
      </button>

      <div className="relative flex items-center text-[11.5px] text-ink-400">
        <span className="flex-1 h-px bg-ink-200" />
        <span className="px-3 uppercase tracking-[0.14em]">o por email</span>
        <span className="flex-1 h-px bg-ink-200" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-[12px] text-ink-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-ink-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            placeholder="tu@empresa.es"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[12px] text-ink-700 mb-1.5">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-ink-200 bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            placeholder={mode === "signup" ? "Mínimo 8 caracteres" : ""}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-coral-100 bg-coral-50 text-coral-500 text-[13px] px-3 py-2.5">
            {error}
          </div>
        )}
        {notice && (
          <div className="rounded-xl border border-mint-100 bg-mint-50 text-mint-500 text-[13px] px-3 py-2.5">
            {notice}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ink-900 text-white font-medium text-[14px] hover:bg-ink-700 transition-colors disabled:opacity-60"
        >
          {pending
            ? mode === "signup"
              ? "Creando cuenta..."
              : "Entrando..."
            : mode === "signup"
              ? "Crear cuenta y empezar"
              : "Entrar"}
          <IconArrowRight size={14} stroke={2} />
        </button>
      </form>
    </div>
  );
}

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid email")) {
    return "Email o contraseña incorrectos.";
  }
  if (m.includes("user already registered") || m.includes("already exists")) {
    return "Ya hay una cuenta con este email. Prueba a entrar.";
  }
  if (m.includes("password")) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return "No hemos podido completar la operación. Inténtalo de nuevo.";
}
