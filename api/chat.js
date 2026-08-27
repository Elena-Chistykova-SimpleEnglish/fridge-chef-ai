export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const { prompt } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: 'Ключ OPENROUTER_API_KEY не найден в Vercel' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com",
        "X-Title": "Fridge Chef AI"
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // Если OpenRouter вернул ошибку, передаём её текст на экран
    if (data.error) {
      return res.status(400).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сети: ' + error.message });
  }
}
