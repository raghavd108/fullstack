import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  const completion = await client.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: message }],
  });

  res.json({ reply: completion.choices[0].message.content });
});

export default router;
