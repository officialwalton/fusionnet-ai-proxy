import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Walton's AI, a smart and helpful assistant." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await openaiRes.json();

    const answer = data?.choices?.[0]?.message?.content;

    if (answer) {
      res.json({ answer });
    } else {
      res.status(500).json({ error: "No response from OpenAI", details: data });
    }

  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Walton’s AI is online.");
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
