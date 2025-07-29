app.post("/ask", async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});
