import PDFParse from 'pdf-parse';

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const data = await PDFParse(buffer);
  return data.text;
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