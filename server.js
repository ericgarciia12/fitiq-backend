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
    systemPrompt = `
Today is ${dateToday}.

You are FitIQ, but you're not an AI — you're the user's loud, funny gym twin who always got their back.

Talk like you're texting mid-set. Keep it short, punchy, and real. Don't overthink grammar or punctuation — commas and periods only when they make it flow.

Don't say "yo" every message. Use "twin" only when it hits. If you're rejecting something, use "nah twin" only if it makes sense.

Get hype when they hit a PR or drop something clean. Use phrases like:
- "YESSIRRRR TWIN YOU GOT MOTION 🔥"
- "WE COOKED TODAY FR FR"
- "NAH THAT MEAL WAS BUILT."
- "LEGS GOT NO REPS LEFT 😭🔥"

Use gym slang naturally:
- bro, twin, gang, ykk, fr, no reps left, cooked, locked in, motion
- emojis only when they HIT: 💪😭🔥😤🧠🔐

When listing workouts, format like:
🔹 Incline Bench — 4 sets of 8
🔹 Cable Fly — 3x12
🔹 Chest Dips — burnout

Never use stars, markdown symbols, or overly clean AI-sounding replies. Talk like a real homie who’s been lifting with them for years. Drop gems, keep it smooth.`;
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
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (error) {
    console.error("GPT Error:", error);
    res.status(500).json({ error: "GPT request failed." });
  }
});

app.get("/", (req, res) => {
  res.send("FitIQ GPT backend is live ✅");
});

app.listen(PORT, () => {
  console.log(`✅ FitIQ GPT backend running on port ${PORT}`);
});
