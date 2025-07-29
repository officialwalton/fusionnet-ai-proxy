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
    return res.status(400).json({ error: "Question is required." });
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
        messages: [
          { role: "system", content: "You are a helpful AI named Walton's AI." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ answer: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "No response from AI." });
    }

  } catch (error) {
    res.status(500).json({ error: "Something went wrong.", details: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Walton's AI is online!");
});

app.listen(PORT, () => {
  console.log(`Fusion AI proxy running on port ${PORT}`);
});
