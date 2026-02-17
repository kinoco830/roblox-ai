const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI SERVER READY");
});

app.post("/chat", async (req, res) => {
    const msg = req.body.message || "";
    console.log("受信:", msg);

    try {
        const ai = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "あなたはRobloxのNPC。普通に自然に会話する。AIとは言わない。短めに返す。短気でもいいよ。"
                    },
                    { role: "user", content: msg }
                ],
                temperature: 1.0,
                max_tokens: 80
            })
        });

        const data = await ai.json();
        let text = data.choices?.[0]?.message?.content?.trim();

        if (!text) text = "ん？";

        console.log("AI:", text);
        res.json({ reply: text });

    } catch (err) {
        console.log(err);
        res.json({ reply: "聞こえなかった" });
    }
});

app.listen(3000, () => {
    console.log("AI SERVER READY");
});
