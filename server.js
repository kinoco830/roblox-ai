const express = require("express");
const app = express();

app.use(express.json());

app.post("/chat", async (req, res) => {
    const msg = req.body.message || "こんにちは";

    const reply = "NPCの返事: " + msg;

    res.json({ reply });
});

app.get("/", (req, res) => {
    res.send("AI SERVER READY");
});

app.listen(3000, () => console.log("AI起動"));