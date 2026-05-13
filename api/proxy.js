export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.body;

  try {
    if (type === 'generate-image') {
      const { prompt } = req.body;

      const response = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        return res.status(500).json({ error: err });
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return res.status(200).json({ image: `data:image/jpeg;base64,${base64}` });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
        }
