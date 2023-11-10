import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "3bacdd76-4962-4cdb-8441-5792a0e2c37e",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { query } = req.body;

    const index = new pinecone.Index("answers");

    try {
      // Fetch the embedding for the query
      const embeddingResponse = await createEmbedding(query); // Use the createEmbedding function you've already written

      // Query Pinecone with the embedding
      const results = await index.query({
        topK: 5,
        vector: embeddingResponse,
      });

      // Assuming you have a way to map results to actual answers
      res.status(200).json({ results });
    } catch (error) {
      res.status(500).json({ error: "Error querying Pinecone." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
