"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AgentFormField, AgentFormSpec } from "@/agents/_form";
import {
  IconBolt,
  IconCheck,
  IconCopy,
  IconRepeat,
  IconSparkles,
  IconStar,
} from "@/components/landing/icons";
import { type RunAgentResult, runAgent } from "@/server/actions/run-agent";

type Props = { slug: string; creditsCost: number; form: AgentFormSpec };

type Variant = { label: string; text: string };

type FormValues = Record<string, string | number>;

const INPUT_CLASSES =
  "w-full px-3 py-2.5 rounded-xl border border-ink-200 bg-paper text-[14px] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";

function initialValues(form: AgentFormSpec): FormValues {
  const values: FormValues = {};
  for (const field of form.fields) {
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
    } else if (field.type === "stars") {
      values[field.name] = 4;
    } else if (field.type === "select") {
      values[field.name] = field.options?.[0]?.value ?? "";
    } else {
      values[field.name] = "";
    }
  }
  return values;
}

function toPayload(values: FormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    payload[key] = value === "" ? undefined : value;
  }
  return payload;
}

export function AgentRunner({ slug, creditsCost, form }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<RunAgentResult | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [values, setValues] = useState<FormValues>(() => initialValues(form));

  function setValue(name: string, value: string | number) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    setDurationMs(null);
    const startedAt = Date.now();

    startTransition(async () => {
      const res = await runAgent(slug, toPayload(values));
      setDurationMs(Date.now() - startedAt);
      setResult(res);
      if (res.ok) router.refresh();
    });
  }

  const variants = result?.ok && hasVariants(result.output) ? result.output.variants : null;

  return (
    <div className="grid lg:grid-cols-[1fr_1.15fr] gap-5">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl bg-white border border-ink-200 p-5 sm:p-6 flex flex-col gap-4"
      >
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Formulario</div>

        <div className="grid sm:grid-cols-2 gap-3">
          {form.fields.map((field) => (
            <div
              key={field.name}
              className={field.type === "textarea" || field.fullWidth ? "sm:col-span-2" : undefined}
            >
              <Field label={field.label} required={field.required} hint={field.hint}>
                <FieldInput field={field} value={values[field.name]} onChange={setValue} />
              </Field>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink-900 text-white font-medium text-[14px] hover:bg-ink-700 transition-colors disabled:opacity-60"
        >
          <IconBolt size={14} stroke={2} />
          {pending ? "Generando..." : `Ejecutar agente · ${creditsCost} créditos`}
        </button>
      </form>

      <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-5 sm:p-6 min-h-[320px] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-brand-700 inline-flex items-center gap-1.5">
            <IconSparkles size={11} /> Resultado
          </div>
          {durationMs !== null && (
            <span className="text-[11.5px] text-ink-500 inline-flex items-center gap-1">
              <IconCheck size={11} stroke={2.5} className="text-mint-500" />
              Listo en {(durationMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>

        {!result && !pending && (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <p className="text-[13.5px] text-ink-500 max-w-sm">{form.resultNote}</p>
          </div>
        )}

        {pending && (
          <div className="space-y-3 flex-1">
            {Array.from({ length: form.expectedVariants }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <div key={i} className="space-y-2">
                <div className="h-3 w-24 rounded-md shimmer" />
                <div className="h-3 rounded-md shimmer" />
                <div className="h-3 w-11/12 rounded-md shimmer" />
                <div className="h-3 w-9/12 rounded-md shimmer" />
              </div>
            ))}
          </div>
        )}

        {result?.ok === false && (
          <div className="rounded-xl border border-coral-100 bg-coral-50 text-coral-500 text-[13.5px] px-4 py-3 flex flex-col gap-2">
            <span>{result.error.message}</span>
            {result.error.cta && (
              <a
                href={result.error.cta.href}
                className="self-start text-[13px] font-medium text-ink-900 bg-white border border-coral-100 px-3 py-1.5 rounded-lg hover:bg-coral-50"
              >
                {result.error.cta.label}
              </a>
            )}
          </div>
        )}

        {variants && (
          <div className="space-y-3 flex-1">
            {variants.map((v) => (
              <VariantCard key={v.label} variant={v} />
            ))}
          </div>
        )}

        {result?.ok && (
          <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-[11.5px] text-ink-500">
            <span>Has gastado {result.creditsCharged} créditos en esta ejecución.</span>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setDurationMs(null);
              }}
              className="inline-flex items-center gap-1 text-ink-700 hover:text-ink-900"
            >
              <IconRepeat size={12} /> Probar otra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: AgentFormField;
  value: string | number | undefined;
  onChange: (name: string, value: string | number) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(field.name, e.target.value)}
        required={field.required}
        minLength={field.minLength}
        maxLength={field.maxLength}
        rows={field.rows ?? 4}
        placeholder={field.placeholder}
        className={`${INPUT_CLASSES} resize-y`}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(field.name, e.target.value)}
        required={field.required}
        className={INPUT_CLASSES}
      >
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "stars") {
    const rating = typeof value === "number" ? value : 4;
    return (
      <div className="flex items-center gap-0.5 px-3 py-2.5 rounded-xl border border-ink-200 bg-paper">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            type="button"
            key={i}
            onClick={() => onChange(field.name, i)}
            aria-label={`${i} estrellas`}
            className={`p-0.5 ${i <= rating ? "text-coral" : "text-ink-300"} hover:scale-110 transition-transform`}
          >
            <IconStar size={18} className={i <= rating ? "fill-current" : ""} />
          </button>
        ))}
        <span className="ml-auto text-[12px] text-ink-500 num-tab">{rating}/5</span>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(field.name, e.target.value)}
      required={field.required}
      minLength={field.minLength}
      maxLength={field.maxLength}
      placeholder={field.placeholder}
      className={INPUT_CLASSES}
    />
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] text-ink-700 flex items-center gap-1">
        {label}
        {required && <span className="text-coral">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11.5px] text-ink-400">{hint}</span>}
    </div>
  );
}

function VariantCard({ variant }: { variant: Variant }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(variant.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <article className="rounded-xl bg-white border border-brand-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-[0.12em] text-brand-700 font-medium">
          {variant.label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-[11.5px] text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
        >
          {copied ? (
            <IconCheck size={12} className="text-mint-500" stroke={2.4} />
          ) : (
            <IconCopy size={12} />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="text-[13.5px] leading-relaxed text-ink-900 whitespace-pre-wrap">
        {variant.text}
      </p>
    </article>
  );
}

function hasVariants(output: unknown): output is { variants: Variant[] } {
  if (!output || typeof output !== "object") return false;
  const obj = output as { variants?: unknown };
  return Array.isArray(obj.variants);
}
