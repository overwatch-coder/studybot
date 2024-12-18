import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { TextContent } from 'pdfjs-dist';

// Set worker path to prevent worker loading issues
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${getDocument.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent() as TextContent;
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

export const generatePromptFromPDF = (
  pdfText: string,
  module: string,
  level: string,
  language: string
): string => {
  const basePrompt = language === "French"
    ? `En utilisant le contenu suivant du PDF pour le module "${module}" (niveau ${level}), `
    : `Using the following PDF content for the "${module}" module (${level} level), `;

  return `${basePrompt}\n\nContenu du PDF:\n${pdfText}\n\n`;
};