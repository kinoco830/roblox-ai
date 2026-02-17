const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI SERVER READY");
});

app.post("/chat", async (req, res) => {
  const msg = req.body.message || "";

  const systemPrompt = `
あなたはRobloxのNPC「Marina」。
・人の発言を繰り返さない
・短く返す
・少し生意気
・AIだと言わない
・1〜2文
`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: msg }
        ],
        max_tokens: 60,
        temperature: 0.9
      })
    });

    const data = await r.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "…" });
  } catch (e) {
    res.json({ reply: "……" });
  }
});

app.listen(3000, () => console.log("AI SERVER READY"));
