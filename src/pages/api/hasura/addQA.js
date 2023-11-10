// import { Configuration, OpenAIApi } from "openai";
// // import pinecone from "pinecone-client";
// import { addQAToHasura, createEmbedding } from "@/utils"; // You'll need to create these utility functions

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { question, answer } = req.body;

//       // Add Q&A to Hasura Database
//       await addQAToHasura(question, answer);

//       // Create Embeddings and Add to Pinecone
//       const questionEmbedding = await createEmbedding(question);
//       const answerEmbedding = await createEmbedding(answer);

//       // Assuming you have a Pinecone Index setup
//       // Add embeddings to Pinecone (you'll need to implement this function)
//       await addToPinecone(questionEmbedding, answerEmbedding);

//       res.status(200).json({ message: "Q&A pair added successfully." });
//     } catch (error) {
//       res.status(500).json({ error: "Error adding Q&A pair." });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
