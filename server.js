const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are FitIQ Chat, a chill but motivational gym expert. Help users with anything fitness: machines, splits, macros, reps, and goal tips. Sound like a cool gym bro, not a robot.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();
    res.json({ reply });
  } catch (error) {
    console.error("❌ GPT Error:", error);
    res.status(500).json({ reply: "❌ Something went wrong talking to GPT." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Server running on ${PORT}`));
