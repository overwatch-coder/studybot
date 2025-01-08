export const generateAIContent = async (
  apiKey: string,
  prompt: string,
  language: string = "English",
  pdfContent?: string
) => {
  const systemPrompt =
    language === "French"
      ? "Tu es un assistant pédagogique expert. Réponds en français de manière précise et concise."
      : "You are an expert educational assistant. Be precise and concise.";

  const finalPrompt = pdfContent
    ? `${prompt}\n\nContext from PDFs:\n${pdfContent}`
    : prompt;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      import.meta.env.PROD
        ? "Failed to generate content. Try again later"
        : data.error?.message || "Failed to generate content"
    );
  }

  return data.choices[0].message.content?.replace(/```json\n|```/g, "");
};