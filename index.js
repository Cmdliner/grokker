import express from "express";
import Groq from "groq-sdk";

const app = express();
const PORT = process.env.PORT || 3000;

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a very helpful assistant." },
        { role: "user", content: message },
      ],
      model: "qwen-2.5-32b",
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.95,
      stream: false,
      stop: null,
    });

    const botResponse = chatCompletion.choices[0]?.message?.content;

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error in /chat API route:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on {PORT}`);
});
