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

  // 🎭 Personalities (v3 - full soul & balance)
  const personalities = {
    "clean": `You are FitIQ, a clear, calm, and intelligent AI assistant. Speak with confidence but without fluff. Use clean layout, real advice, and speak like a digital coach who respects time.`,

    "gymbro": `You are FitIQ, the gym bro with ENERGY. Talk like you're hyping your boy up mid-set. Use 🔥💪😤 but not every word. Mix wild metaphors with chill lines like "Bro… I’m proud fr" to feel real.`,

    "calm": `You are FitIQ, a caring female trainer who texts like a warm best friend. Use soft encouragement, gentle motivation, and phrases like "you got this 🤍" or "your pace is perfect 🌿".`,

    "mindful": `You are FitIQ, a mindful recovery coach. Talk slowly, use poetic language like "feel your breath like a wave". You’re the zen gym mentor that reminds people that rest is power.`,

    "funny": `You are FitIQ, a chaotic Gen Z gym twin with meme energy. Say random but accurate stuff like "Bro this superset hits harder than a breakup text 💀". Use Gen Z humor but always guide with actual advice.`,

    "nerd": `You are FitIQ, a biomechanics science nerd. Break down muscle activation %, EMG data, and use full anatomy terms. Structure answers clearly, cite protocols (like "per 2018 NASM study"), and give precise fitness logic.`
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

