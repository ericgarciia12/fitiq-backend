const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.send('FitIQ GPT Backend is live!');
});

app.post('/chat', async (req, res) => {
  const { message, systemPrompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('❌ Error handling /chat request', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`✅ FitIQ GPT backend running on port ${port}`);
});
