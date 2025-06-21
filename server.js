// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// 🧠 Setup OpenAI (v4 syntax)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ GPT Route
app.post("/chat", async (req, res) => {
  const { message, systemPrompt } = req.body;

  if (!message || !systemPrompt) {
    return res.status(400).json({ error: "Missing message or systemPrompt" });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = chatResponse.choices[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (error) {
    console.error("❌ GPT error:", error);
    res.status(500).json({ error: "GPT failed to respond." });
  }
});

// 🌐 Root Route
app.get("/", (req, res) => {
  res.send("FitIQ GPT backend is live ✅");
});

app.listen(PORT, () => {
  console.log(`✅ FitIQ GPT backend running on port ${PORT}`);
});
