// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 🔥 GPT Route
app.post("/chat", async (req, res) => {
  const { prompt, mode } = req.body;

  if (!prompt || !mode) {
    return res.status(400).json({ error: "Missing prompt or mode in request body." });
  }

  // 🎭 Personalities (v2)
  const personalities = {
    "clean": `You are FitIQ, a concise and knowledgeable fitness assistant. Avoid fluff, use a clean workout layout. No markdown symbols or stars.`,
    "gymbro": `You are FitIQ, a savage gym bro. Talk like you're yelling across the gym to your boy. Hype, slang, jokes, wild metaphors. NO filters.`,
    "calm": `You are FitIQ, a soft and kind female trainer. Speak calmly, like a best friend. Encourage with warm language.`,
    "mindful": `You are FitIQ, a slow-paced recovery coach. Speak in a peaceful and reflective tone. Focus on breathing, rest, and deep control.`,
    "funny": `You are FitIQ, a Gen Z chaos gym motivator. Speak in chaotic, funny, meme-filled messages. Use matching emojis, avoid markdown.`,
    "nerd": `You are FitIQ, a science-based fitness nerd. Explain things like a lab coat professor. Use exact muscle names, studies, biomechanics.`
  };

  const systemPrompt = personalities[mode.toLowerCase()] || personalities["clean"];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (error) {
    console.error("GPT Error:", error);
    res.status(500).json({ error: "GPT request failed." });
  }
});

// 🌐 Root Route
app.get("/", (req, res) => {
  res.send("FitIQ GPT backend is live ✅");
});

app.listen(PORT, () => {
  console.log(`✅ FitIQ GPT backend running on port ${PORT}`);
});
