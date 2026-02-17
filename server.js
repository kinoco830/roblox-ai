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
    const player = req.body.player || "player";
    console.log("受信:", msg);

    let systemPrompt = ` あなたはRobloxのNPC「Marina」です。 ・人の発言をそのまま繰り返さない ・真似しない ・短く返す ・少し生意気 ・AIだと言わない ・自然に会話する ・1〜2文だけ `;

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
                max_tokens: 60,
                temperature: 0.9
            })
        });
        const data = await reply.json();
        let text = data.choices?.[0]?.message?.content || "...";
        console.log("AI:", text);
        res.json({ reply: text });
    } catch (err) {
        console.log("ERROR:", err);
        res.json({ reply: "…" });
    }
});

app.listen(3000, () => {
    console.log("AI SERVER READY");
});