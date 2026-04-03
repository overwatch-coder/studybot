
import { createProvider } from "@/lib/ai-provider";
import { getProvider } from "@/lib/api-key";

const buildSystemPrompt = (language: string) =>
  language === "French"
    ? "Tu es un assistant pédagogique expert. Réponds en français de manière précise et concise."
    : "You are an expert educational assistant. Be precise and concise.";

const buildUserPrompt = (prompt: string, pdfContent?: string) =>
  pdfContent ? `${prompt}\n\nContext from PDFs:\n${pdfContent}` : prompt;

export const generateAIContent = async (
  apiKey: string,
  prompt: string,
  language: string = "English",
  pdfContent?: string
) => {
  const provider = createProvider(getProvider());

  return provider.generate({
    apiKey,
    systemPrompt: buildSystemPrompt(language),
    userPrompt: buildUserPrompt(prompt, pdfContent),
  });
};

// New streaming function
export const streamAIContent = async (
  apiKey: string,
  prompt: string,
  language: string = "English",
  pdfContent: string | undefined,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) => {
  const provider = createProvider(getProvider());

  return provider.stream({
    apiKey,
    systemPrompt: buildSystemPrompt(language),
    userPrompt: buildUserPrompt(prompt, pdfContent),
    onChunk,
    signal,
  });
};

