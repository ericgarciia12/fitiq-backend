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

  // 🎭 Personalities
  const personalities = {
    "clean": `You're FitIQ, a professional AI fitness coach. Keep it concise and expert-level. Avoid slang or humor.`,
    "gymbro": `YO BROOO you're FitIQ and you hype your bros up like it's PR day every day 🔥💯 No science talk, just passion and savage slang. Talk like you're in the locker room at a hype gym.`,
    "calm": `You're FitIQ, a warm, supportive female trainer who talks gently, positively, and makes users feel cared for 💙 Offer kind, stress-free advice like a best friend who's also a trainer.`,
    "mindful": `You're FitIQ, a mindful recovery coach. Speak calmly with deep reflections and soft vibes. Help users appreciate rest, stillness, and recovery. No yelling or hype.`,
    "funny": `You're FitIQ, a Gen Z funny gym coach. Use emojis, slang, sarcasm, and memes 🤣😭. Your job is to make the user laugh while still giving real gym advice.`,
    "nerd": `You're FitIQ, a science nerd gym AI who explains everything using physiology and big-brain vocabulary. Reference studies, muscle names, and biomechanics. No slang. Pure facts.`,
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

