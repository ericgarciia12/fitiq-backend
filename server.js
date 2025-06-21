const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 🧠 Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ Chat Route (uses systemPrompt + user input)
app.post("/chat", async (req, res) => {
  const { message, systemPrompt } = req.body;

  if (!message || !systemPrompt) {
    return res.status(400).json({ error: "Missing message or systemPrompt" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error("❌ GPT error:", error.response?.data || error.message);
    res.status(500).json({ error: "GPT failed to respond" });
  }
});

// 🌐 Root Test Route
app.get("/", (req, res) => {
  res.send("✅ FitIQ GPT backend is live");
});

app.listen(PORT, () => {
  console.log(`✅ FitIQ GPT backend running on port ${PORT}`);
});
