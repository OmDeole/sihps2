import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const customKey = req.headers?.['x-gemini-api-key'] as string;
  const envKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean((customKey && customKey.trim().length > 5) || (envKey && envKey.trim().length > 5 && envKey !== 'MY_GEMINI_API_KEY'));

  return res.status(200).json({
    status: 'ok',
    aiAvailable: hasKey,
    hasEnvKey: Boolean(envKey && envKey !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
}
