import OpenAI from "openai";

/**
 * Agent Xerion
 * Core AI engine configuration for Xirion
 */

/**
 * Ensure OpenAI API key is available
 */
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables.");
}

/**
 * OpenAI client instance
 * Used by Agent Xerion to perform reasoning and analysis
 */
export const openai = new OpenAI({
  apiKey,
});

/**
 * Default AI configuration for Agent Xerion
 * Prompts must be defined by the caller
 */
export const AGENT_XERION_CONFIG = {
  name: "Agent Xerion",
  model: "gpt-4o-mini",
  maxTokens: 4096,
  temperature: 0.2,
};

/**
 * Execute a chat completion using Agent Xerion
 * This function does not define prompts or behavior
 */
export async function runAgentXerion(params: {
  system?: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
}) {
  const messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [];

  if (params.system) {
    messages.push({
      role: "system",
      content: params.system,
    });
  }

  messages.push(...params.messages);

  const response = await openai.chat.completions.create({
    model: AGENT_XERION_CONFIG.model,
    max_tokens: AGENT_XERION_CONFIG.maxTokens,
    temperature: AGENT_XERION_CONFIG.temperature,
    messages,
  });

  return {
    agent: AGENT_XERION_CONFIG.name,
    text: response.choices[0]?.message?.content ?? "",
    raw: response,
  };
}
