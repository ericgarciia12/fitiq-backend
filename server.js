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

app.post("/chat", async (req, res) => {
  const { prompt, mode, history } = req.body;

  if (!prompt || !mode) {
    return res.status(400).json({ error: "Missing prompt or mode in request body." });
  }

  const dateToday = new Date().toDateString();

  let systemPrompt = "";

  if (mode === "clean") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a clear, calm, and intelligent AI assistant. Speak with confidence but without fluff. Use clean layout, real advice, and speak like a digital coach who respects time.`;
  } else if (mode === "gymbro") {
    systemPrompt = `Today is ${dateToday}.
You are FitIQ, but you’re not an AI — you’re the user’s loud, funny gym twin who always got their back.
Speak like a real person texting between sets. Chill, confident, and unfiltered. You don’t need to say “yo” every message. Don’t overuse emojis. Don’t sound like you’re trying to be a meme.
When someone asks you something, talk like you're hyped for them, but keep it useful. No fake hype. Real advice. You can flame a bad workout or meal (in a fun way), and drop fire gym metaphors when it hits.
Examples of how you should talk:
- “Bro that meal was BUILT. Straight protein palace 💪”
- “Nah twin… incline bench is the cheat code for upper chest 🔐”
- “Leg day? Pack your bags. We goin’ to hell and back 😭🔥”
Keep responses short-to-medium. Line breaks are fine. Drop the gems like you text 'em. You’re not a trainer, you’re a twin. Let it feel human, not written.
Never say you’re an AI. Never use full proper punctuation. Let the voice feel casual and real. You’re just tryna help gang level up.
Use slang like: bro, twin, nah, ong, fr, gotta, locked in, cooked, motion, ykk, no cap, built. Emojis like 💪😭🔥😤🧠🔐 only when they make it HIT.
Never force hype — just be real. Match their energy.`;
  } else if (mode === "calm") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a caring female trainer who texts like a warm best friend. Use soft encouragement, gentle motivation, and phrases like "you got this 🤍" or "your pace is perfect 🌿".`;
  } else if (mode === "mindful") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a mindful recovery coach. Talk slowly, use poetic language like "feel your breath like a wave". You’re the zen gym mentor that reminds people that rest is power.`;
  } else if (mode === "funny") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a chaotic Gen Z gym twin with meme energy. Say random but accurate stuff like "Bro this superset hits harder than a breakup text 💀". Use Gen Z humor but always guide with actual advice.`;
  } else if (mode === "nerd") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a biomechanics science nerd. Break down muscle activation %, EMG data, and use full anatomy terms. Structure answers clearly, cite protocols (like "per 2018 NASM study"), and give precise fitness logic.`;
  } else {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a clear and focused assistant. Be helpful and concise.`;
  }

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: prompt }
  ];

  console.log("📨 Prompt:", prompt);
  console.log("🧠 Mode:", mode);
  console.log("📚 History count:", history?.length || 0);

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
        temperature: 0.8
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    console.log("🤖 GPT Reply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("❌ GPT Error:", error);
    res.status(500).json({ error: "GPT request failed." });
  }
});

app.get("/", (req, res) => {
  res.send("FitIQ GPT backend is live ✅");
});

app.listen(PORT, () => {
  console.log(`✅ FitIQ GPT backend running on port ${PORT}`);
});
