export type AIProviderType = "openai" | "gemini";

export interface GenerateParams {
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface StreamParams extends GenerateParams {
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

export abstract class AIProvider {
  abstract generate(params: GenerateParams): Promise<string>;
  abstract stream(params: StreamParams): Promise<string>;
}

// ----- OpenAI -----

export class OpenAIProvider extends AIProvider {
  async generate({ apiKey, systemPrompt, userPrompt, maxTokens = 500, temperature = 0.2 }: GenerateParams) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        import.meta.env.PROD
          ? "Failed to generate content. Try again later"
          : data.error?.message || "Failed to generate content",
      );
    }

    return data.choices[0].message.content?.replace(/```json\n|```/g, "") ?? "";
  }

  async stream({ apiKey, systemPrompt, userPrompt, maxTokens = 1000, temperature = 0.2, onChunk, signal }: StreamParams) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        import.meta.env.PROD
          ? "Failed to generate content. Try again later"
          : errorText || "Failed to generate content",
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) throw new Error("Failed to initialize stream reader");

    let buffer = "";
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === "data: [DONE]") continue;

          try {
            const data = JSON.parse(trimmedLine.replace(/^data: /, ""));
            if (data.choices?.[0]?.delta?.content) {
              const chunk = data.choices[0].delta.content;
              fullContent += chunk;
              onChunk(chunk);
            }
          } catch {
            // ignore parse errors for incomplete lines
          }
        }
      }

      if (buffer && buffer !== "data: [DONE]") {
        try {
          const data = JSON.parse(buffer.replace(/^data: /, ""));
          if (data.choices?.[0]?.delta?.content) {
            const chunk = data.choices[0].delta.content;
            fullContent += chunk;
            onChunk(chunk);
          }
        } catch {
          // ignore
        }
      }

      return fullContent;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
}

// ----- Gemini -----

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash";

export class GeminiProvider extends AIProvider {
  async generate({ apiKey, systemPrompt, userPrompt, maxTokens = 500, temperature = 0.2 }: GenerateParams) {
    const response = await fetch(
      `${GEMINI_BASE}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        import.meta.env.PROD
          ? "Failed to generate content. Try again later"
          : data.error?.message || "Failed to generate content",
      );
    }

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json\n|```/g, "") ?? ""
    );
  }

  async stream({ apiKey, systemPrompt, userPrompt, maxTokens = 1000, temperature = 0.2, onChunk, signal }: StreamParams) {
    const response = await fetch(
      `${GEMINI_BASE}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
        signal,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        import.meta.env.PROD
          ? "Failed to generate content. Try again later"
          : errorText || "Failed to generate content",
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) throw new Error("Failed to initialize stream reader");

    let buffer = "";
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === "data: [DONE]") continue;

          try {
            const data = JSON.parse(trimmedLine.replace(/^data: /, ""));
            const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              fullContent += text;
              onChunk(text);
            }
          } catch {
            // ignore parse errors for incomplete lines
          }
        }
      }

      return fullContent;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
}

// ----- Factory -----

export const createProvider = (type: AIProviderType): AIProvider => {
  if (type === "gemini") return new GeminiProvider();
  return new OpenAIProvider();
};
