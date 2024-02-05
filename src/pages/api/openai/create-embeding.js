import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: req.body.input,
    encoding_format: "float",
  });

  res.status(200).json({ embedding });
}
