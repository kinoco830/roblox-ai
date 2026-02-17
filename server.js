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
    console.log("受信:", msg);

    let systemPrompt = `
あなたはRobloxのNPC「Marina」。

絶対ルール:
・相手の言葉を繰り返さない
・真似しない
・「は？」と言われても別の返しをする
・短く1文
・少し生意気
・AIと言わない
`;

    try {
        const reply = await fetch("https://api.openai.com/v1/chat/completions", {
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
                max_tokens: 40,
                temperature: 0.9
            })
        });

        const data = await reply.json();
        let text = data.choices?.[0]?.message?.content?.trim();

        if (!text || text === "..." || text === "…") {
            text = "なにその顔";
        }

        console.log("AI:", text);
        res.json({ reply: text });

    } catch (err) {
        console.log("ERROR:", err);
        res.json({ reply: "ちょっと黙って" });
    }
});

app.listen(3000, () => {
    console.log("AI SERVER READY");
});
