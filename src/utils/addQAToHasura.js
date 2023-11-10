import axios from "axios";

// Function to add Q&A to Hasura
export async function addQAToHasura(question, answer) {
  const HASURA_ENDPOINT = process.env.HASURA_URL; // Replace with your Hasura GraphQL endpoint
  const HASURA_ADMIN_SECRET = process.env.HASURA_SECRET; // Replace with your Hasura admin secret

  const query = `
    mutation AddQA($question: String!, $answer: String!) {
      insert_your_table_name(objects: {question: $question, answer: $answer}) {
        affected_rows
      }
    }
  `;

  const variables = {
    question: question,
    answer: answer,
  };

  const response = await axios.post(
    HASURA_ENDPOINT,
    {
      query: query,
      variables: variables,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
      },
    }
  );

  return response.data;
}
