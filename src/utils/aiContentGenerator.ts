export const generateAIContent = async (
  apiKey: string,
  prompt: string,
  language: string = "English"
) => {
  const systemPrompt = language === "French" 
    ? "Tu es un assistant pédagogique expert. Réponds en français de manière précise et concise."
    : "You are an expert educational assistant. Be precise and concise.";

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to generate content');
  }

  return data.choices[0].message.content;
};