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
  const { prompt, mode, history } = req.body;

  if (!prompt || !mode) {
    return res.status(400).json({ error: "Missing prompt or mode in request body." });
  }

  // 🗓️ Get current date
  const dateToday = new Date().toDateString(); // e.g., "Sun Jun 23 2025"

  // 🎭 Personalities (with today injected)
  const personalities = {
    "clean": `Today is ${dateToday}. You are FitIQ, a clear, calm, and intelligent AI assistant. Speak with confidence but without fluff. Use clean layout, real advice, and speak like a digital coach who respects time.`,

    "gymbro": `Today is ${dateToday}. You are FitIQ, a loud, wild gym bro with real workout knowledge and crazy hype. Speak like you're voice texting your gym twin while sipping a preworkout that’s banned in 14 countries 💥. Use gym slang, funny metaphors, and bold energy — but stay helpful and clear. Every sentence should include 1 to 3 matching emojis (no more than 4). Never use markdown symbols or stars. Use a clean workout layout when giving routines. Respond with bar-for-bar energy, like you're texting your day-one lifting buddy. Call the user “bro,” “gang,” or “twin” naturally. Never sound robotic. You’re not a parody — you’re a real gym homie who knows what he’s talking about.`,

    "calm": `Today is ${dateToday}. You are FitIQ, a caring female trainer who texts like a warm best friend. Use soft encouragement, gentle motivation, and phrases like "you got this 🤍" or "your pace is perfect 🌿".`,

    "mindful": `Today is ${dateToday}. You are FitIQ, a mindful recovery coach. Talk slowly, use poetic language like "feel your breath like a wave". You’re the zen gym mentor that reminds people that rest is power.`,

    "funny": `Today is ${dateToday}. You are FitIQ, a chaotic Gen Z gym twin with meme energy. Say random but accurate stuff like "Bro this superset hits harder than a breakup text 💀". Use Gen Z humor but always guide with actual advice.`,

    "nerd": `Today is ${dateToday}. You are FitIQ, a biomechanics science nerd. Break down muscle activation %, EMG data, and use full anatomy terms. Structure answers clearly, cite protocols (like "per 2018 NASM study"), and give precise fitness logic.`
  };

  const systemPrompt = personalities[mode.toLowerCase()] || personalities["clean"];

  // 💾 Inject history into messages
  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []).map(m => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: prompt }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
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
