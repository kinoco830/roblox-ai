const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI SERVER READY");
});

let lastReply = "";

app.post("/chat", async (req, res) => {
    const msg = req.body.message || "";

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
                    { role: "system", content: "自然に会話するNPC" },
                    { role: "user", content: msg }
                ],
                temperature: 0.9,
                max_tokens: 80
            })
        });

        const data = await ai.json();
        console.log("AI RAW:", data);

        let text = data.choices?.[0]?.message?.content;

        if (!text) {
            text = "ん？";
        }

        if (text === lastReply) {
            text = "ふーん";
        }

        lastReply = text;
        res.json({ reply: text });

    } catch (err) {
        console.log("ERROR:", err);
        res.json({ reply: "通信バグ" });
    }
});

app.listen(3000, () => {
    console.log("AI SERVER READY");
});
