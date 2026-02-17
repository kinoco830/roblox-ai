const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        const userMsg = req.body.message || "";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "あなたはRobloxのNPCです。短く自然に会話してください。" },
                    { role: "user", content: userMsg }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "...";

        res.json({ reply });

    } catch (err) {
        console.log(err);
        res.json({ reply: "..." });
    }
});

app.get("/", (req, res) => {
    res.send("AI server running");
});

app.listen(3000, () => {
    console.log("AIサーバー準備完了");
});
