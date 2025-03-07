
import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = new Uint8Array(arrayBuffer);
    
    // Options for pdf-parse
    const options = {
      // Limiting to first 10 pages if PDF is very large for performance
      max: 10,
      // We don't need version info
      pagerender: undefined,
      // We just want the text
      renderhint: "text"
    };
    
    // Use pdf-parse to extract text
    const result = await pdfParse(dataBuffer, options);
    
    // Validate extracted text
    if (!result.text || result.text.trim() === '') {
      throw new Error(`No text content could be extracted from ${file.name}`);
    }
    
    // Process the text to improve quality
    const processedText = result.text
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
