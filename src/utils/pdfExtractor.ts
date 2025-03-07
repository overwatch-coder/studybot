
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document with proper error handling
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    // Add specific error handler for the loading task
    loadingTask.onPassword = function(updatePassword: (password: string) => void, reason: number) {
      console.error('Password required for PDF, currently not supported');
      throw new Error('Password-protected PDFs are not supported');
    };
    
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text from the page with better handling
      const pageText = textContent.items
        .map((item: any) => {
          // Handle different item structures
          return typeof item.str === 'string' ? item.str : '';
        })
        .join(' ')
        .trim();
      
      if (pageText) {
        fullText += pageText + '\n\n';
      }
    }
    
    // Additional processing to ensure text quality
    fullText = fullText.trim();
    
    // Validate extracted text
    if (!fullText) {
      // If no text was extracted, throw a specific error
      throw new Error(`No text content could be extracted from ${file.name}`);
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    // Provide more specific error messages based on the error type
    const errorMessage = error instanceof Error 
      ? error.message 
      : `Unknown error while processing ${file.name}`;
    
    throw new Error(`Failed to extract text from PDF: ${file.name}. ${errorMessage}`);
  }
};

export const generatePromptFromPDF = (
  pdfText: string,
  module: string,
  level: string,
  language: string
): string => {
  // Improved text sanitization
  const sanitizedText = pdfText
    .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Make sure we have text after sanitization
  if (!sanitizedText) {
    throw new Error('PDF content is empty after sanitization');
  }

  const basePrompt = language === "French"
    ? `En utilisant le contenu suivant du PDF pour le module "${module}" (niveau ${level}), `
    : `Using the following PDF content for the "${module}" module (${level} level), `;

  return `${basePrompt}\n\nContent:\n${sanitizedText}\n\n`;
};
