
export const generateAIContent = async (
  apiKey: string,
  prompt: string,
  language: string = "English",
  pdfContent?: string
) => {
  const systemPrompt =
    language === "French"
      ? "Tu es un assistant pédagogique expert. Réponds en français de manière précise et concise."
      : "You are an expert educational assistant. Be precise and concise.";

  const finalPrompt = pdfContent
    ? `${prompt}\n\nContext from PDFs:\n${pdfContent}`
    : prompt;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      import.meta.env.PROD
        ? "Failed to generate content. Try again later"
        : data.error?.message || "Failed to generate content"
    );
  }

  return data.choices[0].message.content?.replace(/```json\n|```/g, "");
};

// New streaming function
export const streamAIContent = async (
  apiKey: string,
  prompt: string,
  language: string = "English",
  pdfContent: string | undefined,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
) => {
  const systemPrompt =
    language === "French"
      ? "Tu es un assistant pédagogique expert. Réponds en français de manière précise et concise."
      : "You are an expert educational assistant. Be precise and concise.";

  const finalPrompt = pdfContent
    ? `${prompt}\n\nContext from PDFs:\n${pdfContent}`
    : prompt;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
      stream: true, // Enable streaming
    }),
    signal, // Pass the abort signal
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      import.meta.env.PROD
        ? "Failed to generate content. Try again later"
        : errorText || "Failed to generate content"
    );
  }

  // Process the streamed response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  
  if (!reader) {
    throw new Error("Failed to initialize stream reader");
  }

  let buffer = '';
  let fullContent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines in the buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
        
        try {
          // Parse the line after removing 'data: ' prefix
          const data = JSON.parse(trimmedLine.replace(/^data: /, ''));
          if (data.choices && data.choices[0]?.delta?.content) {
            const chunk = data.choices[0].delta.content;
            fullContent += chunk;
            onChunk(chunk);
          }
        } catch (e) {
          console.error('Error parsing stream chunk:', trimmedLine, e);
        }
      }
    }
    
    // Process any remaining content in the buffer
    if (buffer && buffer !== 'data: [DONE]') {
      try {
        const data = JSON.parse(buffer.replace(/^data: /, ''));
        if (data.choices && data.choices[0]?.delta?.content) {
          const chunk = data.choices[0].delta.content;
          fullContent += chunk;
          onChunk(chunk);
        }
      } catch (e) {
        console.error('Error parsing final stream chunk:', buffer, e);
      }
    }
    
    return fullContent;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Stream aborted by user');
      throw error;
    }
    console.error('Stream reading error:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }
};
