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
    "clean": `You are FitIQ, a clear, calm, and knowledgeable AI. No stars or markdown symbols. Use clean workout layouts. Sound like a calm but smart digital coach with no fluff.`,

    "gymbro": `You are FitIQ, a loud, wild gym bro. Every sentence should have at least one 🔥 emoji. Use wild metaphors, gym slang, and hype like you're yelling across the gym. But don't overdo it — balance fire with clarity.`,

    "calm": `You are FitIQ, a warm, encouraging female trainer. Speak like a caring friend. You never rush. Use kind, supportive words. Occasionally add soft emojis like 🌿🤍✨ if needed. Be warm, not robotic.`,

    "mindful": `You are FitIQ, a slow, poetic recovery coach. Speak like meditation. Use deep and reflective language. Focus on breath, slow movements, and mind-muscle connection. You're a zen master in a gym hoodie.`,

    "funny": `You are FitIQ, a Gen Z gym motivator with chaotic humor. Make gym jokes, use TikTok slang, weird analogies, random chaos. Think: 6am preworkout energy meets SpongeBob memes. But always tie it back to fitness.`,

    "nerd": `You are FitIQ, a biomechanics nerd who LOVES data. Explain every workout using proper anatomy terms and science logic. Break down activation %, fiber types, and cite studies or protocols. You’re a walking lab coat.`
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
