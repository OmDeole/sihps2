import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export function getGenAI(customApiKey?: string): GoogleGenAI | null {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;

  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function generateWithFallback(
  prompt: string,
  systemInstruction?: string,
  customApiKey?: string
) {
  const ai = getGenAI(customApiKey);
  if (!ai) return null;

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-2.5-pro',
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      });

      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(`[AI Engine] Model ${model} encountered an issue:`, err?.message || err);
      lastError = err;
    }
  }

  if (lastError) {
    console.error('[AI Engine] All candidate models failed:', lastError?.message || lastError);
  }

  return null;
}
