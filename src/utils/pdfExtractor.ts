import pdfToText from "react-pdftotext";

interface OpenAIEmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

// Extract text from PDF using pdfjs-dist
export const extractTextFromPDF = async (file: File): Promise<string> => {
  const content = await pdfToText(file);

  return content;
};

// Generate a prompt from PDF text based on user inputs
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
