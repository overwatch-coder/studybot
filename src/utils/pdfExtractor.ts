import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker using the worker from node_modules
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map(item => 'str' in item ? item.str : '')
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

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