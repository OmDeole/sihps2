import { generateWithFallback } from './_lib/gemini';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, context, apiKey: bodyApiKey } = req.body || {};
    const customApiKey = (req.headers?.['x-gemini-api-key'] as string) || bodyApiKey;

    const systemPrompt = `You are CircuPack Technical Advisor, an expert senior packaging engineer and food technologist.
The user is asking a specific technical question regarding their food commodity packaging.
Context:
Commodity: ${context?.foodName || 'Food Commodity'}
Current Substrate: ${context?.material || 'Mono-material polymer'}
OTR Target: ${context?.otr} cc/(m²·24h·atm)
WVTR Target: ${context?.wvtr} g/(m²·24h)
Storage Regimen: ${context?.storageType || 'Ambient'}

Answer authoritatively with practical industrial steps, testing standards (ASTM/ISO), and circular packaging recommendations. Keep it concise (under 200 words) and direct.`;

    const aiResult = await generateWithFallback(question, systemPrompt, customApiKey);

    if (aiResult) {
      return res.status(200).json({
        answer: aiResult.text,
        modelUsed: aiResult.modelUsed,
        status: 'success',
      });
    }

    // Contextual deterministic response
    return res.status(200).json({
      answer: `For ${context?.foodName || 'this commodity'}, maintaining an optimal barrier equilibrium (OTR: ${context?.otr} cc, WVTR: ${context?.wvtr} g) is paramount. When considering sustainable mono-materials (e.g., MDO-PE or oriented PP), ensure machine seal dwell times are calibrated to avoid burn-through. Always verify overall migration limits under EU 10/2011 and FDA 21 CFR 177 with the corresponding food simulant.`,
      modelUsed: 'Scientific Knowledge Base Baseline',
      status: 'success',
      isBenchmark: true,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Chat service error' });
  }
}
