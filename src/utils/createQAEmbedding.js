import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "3bacdd76-4962-4cdb-8441-5792a0e2c37e",
});

export const createQAEmbedding = async (question, answer, id) => {
  const response = await axios.post("/api/openai/create-embeding", {
    input: `Question: ${question}, Answer: ${answer}`,
  });

  const embedding = response.data.embedding;

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
