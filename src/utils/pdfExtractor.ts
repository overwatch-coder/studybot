interface OpenAIEmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
    object: string;
  }>;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const text = await file.text();
  return text;
};

export const processWithOpenAI = async (text: string, apiKey: string): Promise<number[]> => {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-ada-002"
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process text with OpenAI');
    }

    const data = (await response.json()) as OpenAIEmbeddingResponse;
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error processing text with OpenAI:', error);
    throw error;
  }
};

export const generatePromptFromPDF = (
  pdfText: string,
  module: string,
  level: string,
  language: string
): string => {
  const basePrompt =
    language === "French"
      ? `En utilisant le contenu suivant du PDF pour le module "${module}" (niveau ${level}), `
      : `Using the following PDF content for the "${module}" module (${level} level), `;

  return `${basePrompt}\n\nContenu du PDF:\n${pdfText}\n\n`;
};