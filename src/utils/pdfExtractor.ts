import { PDFDocument } from 'pdf-lib';

// Improved PDF text extraction with better error handling and chunking
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Process pages in chunks for better performance
    const textChunks = await Promise.all(
      pages.map(async (page) => {
        const text = await page.getText();
        return text.trim();
      })
    );

    return textChunks.join('\n\n');
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${file.name}`);
  }
};

// Optimized prompt generation with text chunking
export const generatePromptFromPDF = (
  pdfText: string,
  module: string,
  level: string,
  language: string
): string => {
  // Split text into manageable chunks (roughly 2000 characters each)
  const chunkSize = 2000;
  const textChunks = [];
  
  for (let i = 0; i < pdfText.length; i += chunkSize) {
    textChunks.push(pdfText.slice(i, i + chunkSize));
  }

  const basePrompt =
    language === "French"
      ? `En utilisant le contenu suivant du PDF pour le module "${module}" (niveau ${level}), `
      : `Using the following PDF content for the "${module}" module (${level} level), `;

  // Join chunks with clear separators
  return `${basePrompt}\n\nContenu du PDF:\n${textChunks.join('\n---\n')}\n\n`;
};