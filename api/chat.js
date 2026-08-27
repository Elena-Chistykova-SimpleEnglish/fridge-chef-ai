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
        "Authorization": "Bearer " + apiKey.trim(),
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com",
        "X-Title": "Fridge Chef AI"
      },
      body: JSON.stringify({
        models: [
          "deepseek/deepseek-chat:free",
          "qwen/qwen-2.5-7b-instruct:free",
          "openrouter/free"
        ],
        messages: [
          { 
            role: "system", 
            content: "You are Chef Oliver, a warm and helpful home chef. Answer clearly and concisely." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 750
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сети: ' + error.message });
  }
}
