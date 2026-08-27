async function sendPrompt() {
    const ingredients = input.value.trim();
    if (!ingredients) return;

    renderUserMessage(ingredients);
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    renderBotMessage(ui[lang].waiting);

    const systemPrompt = `You are Chef Oliver, a friendly, warm home-cooking expert. 
The user wants exactly 3 recipes of category "${category}" made from: "${ingredients}".
Strict guidelines:
- Maximum cooking time for any recipe must be 60 minutes or less.
- Structure:
  1. ⚡ Quick & Simple (15–20 min)
  2. ⏳ Balanced Comfort (30–40 min)
  3. 👨‍🍳 Chef's Choice (45–60 min, strictly not exceeding 1 hour)
- Tone: warm, encouraging, clear.
- Format per recipe: Title, Time estimate, Key steps.
- Response Language: ${lang === 'ru' ? 'Russian' : 'English'}.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: systemPrompt })
      });
      const data = await res.json();
      chat.removeChild(chat.lastChild);

      if (data.choices && data.choices[0]) {
        renderBotMessage(data.choices[0].message.content, [
          { label: ui[lang].reset, action: 'reset' }
        ]);
      } else {
        const errorText = data.error || (lang === 'ru' ? "Не удалось получить ответ" : "Failed to get response");
        renderBotMessage(`⚠️ ${errorText}`);
      }
    } catch (e) {
      chat.removeChild(chat.lastChild);
      renderBotMessage(lang === 'ru' ? "Ошибка сети. Проверьте подключение." : "Network issue. Please try again.");
    }
  }
