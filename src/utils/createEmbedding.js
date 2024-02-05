import axios from "axios";

export const createEmbedding = async (text) => {
  const response = await axios.post("/api/openai/create-embeding", {
    input: text,
  });

  const embedding = response.data.embedding;

  return embedding.data[0].embedding;
};
