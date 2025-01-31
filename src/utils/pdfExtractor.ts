import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Improved PDF text extraction with better error handling and chunking
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let fullText = '';

    // Process pages sequentially to prevent memory issues
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .trim();
      fullText += pageText + '\n\n';
    }

    return fullText;
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
  // Split text into smaller chunks (2000 characters each)
  const chunkSize = 2000;
  const chunks = [];
  
  for (let i = 0; i < pdfText.length; i += chunkSize) {
    chunks.push(pdfText.slice(i, i + chunkSize));
  }

  const basePrompt = language === "French"
    ? `En utilisant le contenu suivant du PDF pour le module "${module}" (niveau ${level}), `
    : `Using the following PDF content for the "${module}" module (${level} level), `;

  // Join chunks with clear separators and remove any potential problematic characters
  const sanitizedContent = chunks
    .join('\n---\n')
    .replace(/[^\x20-\x7E\n]/g, ''); // Keep only printable ASCII characters and newlines

  return `${basePrompt}\n\nContenu du PDF:\n${sanitizedContent}\n\n`;
};