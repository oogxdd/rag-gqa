import { Pinecone } from "@pinecone-database/pinecone";

export default async function handler(req, res) {
  const pinecone = new Pinecone({
    environment: "gcp-starter",
    apiKey: "3bacdd76-4962-4cdb-8441-5792a0e2c37e",
  });

  const index = pinecone.Index("questions");
  console.log(index);
  res.status(200).json({ name: "John Doe" });
}
