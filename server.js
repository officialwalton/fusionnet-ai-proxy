import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Proxy is live.");
});

app.post("/ask", async (req, res) => {
  const question = req.body.question;
  if (!question) return res.status(400).json({ error: "No question" });

  const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Walton’s AI, a helpful assistant." },
        { role: "user", content: question }
      ]
    })
  });

  const data = await openaiResp.json();
  const answer = data.choices?.[0]?.message?.content;
  if (answer) res.json({ answer });
  else res.status(500).json({ error: "No AI response", details: data });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI proxy listening on ${port}`));
￼Enter
