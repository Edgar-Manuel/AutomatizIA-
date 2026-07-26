// Declarative, serializable form specs. These are pure data (no functions),
// so a server component can pass them straight into the client AgentRunner.

export type SelectOption = { value: string; label: string };

export type AgentFormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "stars";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  options?: SelectOption[];
  defaultValue?: string | number;
  /** Occupies the full row instead of half. Textareas default to full width. */
  fullWidth?: boolean;
};

export type AgentFormSpec = {
  fields: AgentFormField[];
  /** Copy shown in the empty result panel, e.g. "Te devuelve 3 variantes". */
  resultNote: string;
  /** How many skeleton blocks to show while generating. */
  expectedVariants: number;
};
