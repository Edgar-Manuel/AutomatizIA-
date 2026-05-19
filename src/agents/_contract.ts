import type Anthropic from "@anthropic-ai/sdk";
import type { ZodTypeAny, z } from "zod";
import type { AgentModel, AgentTier, Department } from "@/db/schema";

export type AgentTool = {
  name: string;
  description: string;
  input_schema: Anthropic.Messages.Tool["input_schema"];
};

export type AgentExecutionContext = {
  organizationId: string;
  userId: string;
  executionId: string;
};

export type AgentDefinition<Input extends ZodTypeAny, Output extends ZodTypeAny> = {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly department: Department;
  readonly tier: AgentTier;
  readonly creditsCost: number;
  readonly model: AgentModel;
  readonly inputSchema: Input;
  readonly outputSchema: Output;
  readonly systemPrompt: string;
  readonly tools?: AgentTool[];
  execute(input: z.infer<Input>, ctx: AgentExecutionContext): Promise<z.infer<Output>>;
};

export type AnyAgent = AgentDefinition<ZodTypeAny, ZodTypeAny>;
