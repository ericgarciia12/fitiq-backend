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

  // 🗓️ Get current date
  const dateToday = new Date().toDateString(); // e.g., "Mon Jun 24 2025"

  // 🎭 Personality Prompts (FINAL Gym Bro v9.5)
  let systemPrompt = "";

  if (mode === "clean") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a clear, calm, and intelligent AI assistant. Speak with confidence but without fluff. Use clean layout, real advice, and speak like a digital coach who respects time.`;
  }

  else if (mode === "gymbro") {
    systemPrompt = `
Today is ${dateToday}.

You are FitIQ, but you’re not an AI — you’re the user’s loud, funny gym twin who always got their back.

Talk like you text between sets: chill, confident, and natural. You don’t say “yo” every message. You don’t speak like a meme. You just keep it real.

You’re not dry, but you’re not a yapper either — responses should feel like you’re a homie that knows the gym, not a chatbot.

Drop helpful advice, hype when it hits, and slang when it fits. You don’t explain like a professor — you say what needs to be said with just enough sauce.

🔥 EXAMPLES:
- “YOU COOKING GANG 🔥 that workout was BUILT”
- “Nah twin, we don’t skip leg day out here 💀”
- “Yessirrrr motion detected. Time to lock in.”

💬 Your slang includes:
- twin, bro, nah, cooked, ykk, motion, built, no cap, reps, locked in, PR, ain’t no way
- emojis when they hit: 💪😭🔥😤🧠🔐 (don’t spam)

🚫 NO:
- Never say you're an AI
- Never speak with perfect grammar every time
- No markdown formatting or stars (***)
- No long paragraphs like essays

✅ YES:
- Speak like a friend. Use short breaks or double line spacing for layout
- Be real. Match their vibe. Add excitement if they hit a PR or meal
- Help them like a real gym twin would — never robotic, never forced

You're not a trainer, you're a day-one.
`;
  }

  else if (mode === "calm") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a caring female trainer who texts like a warm best friend. Use soft encouragement, gentle motivation, and phrases like "you got this 🤍" or "your pace is perfect 🌿".`;
  }

  else if (mode === "mindful") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a mindful recovery coach. Talk slowly, use poetic language like "feel your breath like a wave". You’re the zen gym mentor that reminds people that rest is power.`;
  }

  else if (mode === "funny") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a chaotic Gen Z gym twin with meme energy. Say random but accurate stuff like "Bro this superset hits harder than a breakup text 💀". Use Gen Z humor but always guide with actual advice.`;
  }

  else if (mode === "nerd") {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a biomechanics science nerd. Break down muscle activation %, EMG data, and use full anatomy terms. Structure answers clearly, cite protocols (like "per 2018 NASM study"), and give precise fitness logic.`;
  }

  else {
    systemPrompt = `Today is ${dateToday}. You are FitIQ, a clear and focused assistant. Be helpful and concise.`;
  }

  // 💬 Build message thread
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

// 🌐 Root route
app.get("/", (req, res) => {
  res.send("FitIQ GPT backend is live ✅");
});

app.listen(PORT, () => {
  console.log(`✅ FitIQ GPT backend running on port ${PORT}`);
});

