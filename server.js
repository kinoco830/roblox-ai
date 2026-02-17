import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 環境変数から API キ���を取得
const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const msg = req.body.message;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "ゲームのNPCとして話す" },
          { role: "user", content: msg }
        ]
      })
    });

    const j = await r.json();
    res.json({ reply: j.choices[0].message.content });

  } catch (e) {
    res.json({ reply: "AIエラー" });
  }
});

app.listen(3000, () => console.log("AI server running"));