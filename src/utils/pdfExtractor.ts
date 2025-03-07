
import pdfToText from "react-pdftotext";

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Use react-pdftotext to extract text from the PDF
    const extractedText = await pdfToText(file);
    
    // Validate extracted text
    if (!extractedText || extractedText.trim() === '') {
      throw new Error(`No text content could be extracted from ${file.name}`);
    }
    
    // Process the text to improve quality
    const processedText = extractedText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .replace(/(\r\n|\n|\r)/gm, ' ')  // Replace line breaks with spaces
      .trim();
    
    return processedText;
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
