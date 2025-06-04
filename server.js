const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 10000;

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

// 🧠 Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ GPT Route
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You're FitIQ, a motivational but chill gym expert. Help users with fitness advice, macros, machine guidance, and reps. Talk like a gym friend, not a robot.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT error:", error.response?.data || error.message);
    res.status(500).json({ error: "GPT failed to respond" });
  }
});

// 🌐 Root Route (optional but helpful)
app.get("/", (req, res) => {
  res.send("FitIQ GPT backend is live ✅");
});

app.listen(PORT, () => {
  console.log(`FitIQ GPT backend running on port ${PORT}`);
});


