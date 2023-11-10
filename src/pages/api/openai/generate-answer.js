import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          // { role: "system", content: "You are a helpful assistant." }
          { role: "user", content: prompt },
        ],
        model: "gpt-4-1106-preview", // Or any other suitable model
        // prompt: prompt,
      });

      console.log("completion");
      console.log(completion);
      res.status(200).json({ answer: completion.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: "Error generating answer with OpenAI." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
