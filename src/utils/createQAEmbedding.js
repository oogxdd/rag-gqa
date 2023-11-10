import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "3bacdd76-4962-4cdb-8441-5792a0e2c37e",
});
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const createQAEmbedding = async (question, answer, id) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: `Question: ${question}, Answer: ${answer}`,
    encoding_format: "float",
  });

  console.log(embedding);

  const index = pinecone.index("questions");
  console.log(index);

  // await index("questions").describeIndexStats();

  await index.upsert([
    {
      id: id,
      values: embedding.data[0].embedding,
      metadata: {
        question: question,
        answer: answer,
      },
    },
  ]);

  // await index("questions").describeIndexStats();
};
