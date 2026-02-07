import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";

export const AGENT_XERION_CONFIG = {
  name: "Agent Xerion",
  model: "gpt-4o-mini",
  maxTokens: 4096,
  temperature: 0.2,
};

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in environment variables.");
  }
  return new OpenAI({ apiKey });
}

export async function runAgentXerion(params: {
  system?: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
}) {
  const openai = getOpenAIClient();

  const messages: ChatCompletionMessageParam[] = [];

  if (params.system) {
    messages.push({
      role: "system",
      content: params.system,
    });
  }

  for (const m of params.messages) {
    messages.push({
      role: m.role,
      content: m.content,
    });
  }

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
