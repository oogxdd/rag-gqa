import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const HASURA_ENDPOINT = "YOUR_HASURA_ENDPOINT"; // Replace with your Hasura GraphQL endpoint
    const HASURA_ADMIN_SECRET = "YOUR_HASURA_ADMIN_SECRET"; // Replace with your Hasura admin secret

    const query = `
      query GetQA {
        your_table_name {
          id
          question
          answer
        }
      }
    `;

    try {
      const response = await axios.post(
        HASURA_ENDPOINT,
        {
          query: query,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
          },
        }
      );

      res.status(200).json(response.data.data.your_table_name);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Q&A pairs." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
