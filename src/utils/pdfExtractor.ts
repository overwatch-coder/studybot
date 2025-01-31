import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      
      // Extract text from the page
      const pageText = content.items
        .map((item: any) => item.str || '')
        .join(' ')
        .trim();
      
      if (pageText) {
        fullText += pageText + '\n\n';
      }
    }
    
    // Validate extracted text
    if (!fullText.trim()) {
      throw new Error('No text content found in PDF');
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Could not read PDF content from ${file.name}. Please ensure it's a valid PDF file.`);
  }
};

export const generatePromptFromPDF = (
  pdfText: string,
  module: string,
  level: string,
  language: string
): string => {
  // Basic text sanitization
  const sanitizedText = pdfText
    .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  const basePrompt = language === "French"
    ? `En utilisant le contenu suivant du PDF pour le module "${module}" (niveau ${level}), `
    : `Using the following PDF content for the "${module}" module (${level} level), `;

  return `${basePrompt}\n\nContent:\n${sanitizedText}\n\n`;
};