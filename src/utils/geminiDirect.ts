/**
 * Direct client-side Gemini API fallback for zero-dependency client execution
 */
export async function directGeminiGenerate(
  apiKey: string,
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string; modelUsed: string } | null> {
  if (!apiKey || apiKey.trim().length < 5) return null;

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-2.5-pro',
  ];

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
      const payload: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(`[Direct Gemini] Model ${model} returned ${res.status}:`, err);
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text, modelUsed: `${model} (Direct Client API)` };
      }
    } catch (e) {
      console.warn(`[Direct Gemini] Network exception with model ${model}:`, e);
    }
  }

  return null;
}
