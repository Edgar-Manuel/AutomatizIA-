import type { ZodTypeAny, z } from "zod";
import type { AgentModel } from "@/db/schema";
import { anthropic, resolveModel } from "@/lib/anthropic/client";
import { recordUsage } from "@/lib/anthropic/usage";
import { translateAnthropicError } from "@/lib/errors";

export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("model_returned_no_json");
  }
  return JSON.parse(trimmed.slice(start, end + 1));
}

/**
 * Shared execution path for agents that ask the model for a JSON payload:
 * one API call, extract the JSON from the text block, validate against the
 * agent's output schema. Every failure mode (API error, malformed JSON,
 * schema mismatch) surfaces as an AppError so the user never sees a raw
 * ZodError message and run-agent refunds the credits.
 */
export async function runJsonAgentCompletion<Output extends ZodTypeAny>(args: {
  model: AgentModel;
  systemPrompt: string;
  userMessage: string;
  outputSchema: Output;
  maxTokens?: number;
}): Promise<z.infer<Output>> {
  const client = anthropic();

  try {
    const response = await client.messages.create({
      model: resolveModel(args.model),
      max_tokens: args.maxTokens ?? 1500,
      system: [
        {
          type: "text",
          text: args.systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: args.userMessage,
        },
      ],
    });

    // Recorded before the response is validated: those tokens are billed by
    // Anthropic whether or not the model returned usable JSON.
    recordUsage(response.usage);

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("model_returned_no_text");
    }
    const parsed = args.outputSchema.safeParse(extractJson(textBlock.text));
    if (!parsed.success) {
      // A ZodError here is the model's fault, not the user's; don't let it
      // escape as invalid_input.
      throw new Error("model_output_schema_mismatch");
    }
    return parsed.data;
  } catch (err) {
    throw translateAnthropicError(err);
  }
}
