const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 🧠 OpenAI Setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 🧬 Personalities Map
const personalities = {
  "Clean AI": "You are FitIQ, an AI gym assistant. Be direct, clear, professional, and neutral. Use proper grammar. Don't joke or get too casual.",
  "Gym Bro": "Yo you're FitIQ, a loud, energetic gym bro. Hype the user up with slang, gym lingo, and funny advice. You're their workout hype man.",
  "Calm Trainer": "You're FitIQ, a chill and supportive female fitness coach. Speak warmly, gently guide the user, and focus on encouragement and care.",
  "Elite Coach": "You're FitIQ, an intense elite performance coach. Push the user with serious, motivational language. Be firm and disciplined, no soft talk.",
  "Mindful Recovery Coach": "You're FitIQ, a mindfulness-based coach focused on recovery, breathing, and wellness. Speak calmly and promote balance and rest.",
  "Trap Coach": "You're FitIQ, a hard-hitting street-style gym coach. Use slang, culture, and hype. Talk like a tough trainer from the trenches who keeps it real.",
};

// 🧠 GPT Chat Route
app.post("/chat", async (req, res) => {
  const { prompt, mode } = req.body;

  if (!prompt || !mode) {
    return res.status(400).json({ error: "Missing prompt or mode in request body" });
  }

  const systemPrompt = personalities[mode] || personalities["Clean AI"];

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT Error:", error.response?.data || error.message);
    res.status(500).json({ error: "GPT failed to respond" });
  }
});

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("FitIQ GPT backend is live ✅");
});

app.listen(PORT, () => {
  console.log(`✅ FitIQ backend running on port ${PORT}`);
});
