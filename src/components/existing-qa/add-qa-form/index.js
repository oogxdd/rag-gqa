import React, { useState } from "react";
import axios from "axios";
import { useMutation, gql } from "@apollo/client";
import { createQAEmbedding, generateUniqueId } from "@/utils";

import { Button, Input, Checkbox, Box } from "@/components/ui";

const ADD_PAIR_MUTATION = gql`
  mutation AddPair($question: String!, $answer: String!) {
    insert_pairs_one(object: { question: $question, answer: $answer }) {
      id
    }
  }
`;

export default function QAForm() {
  const [expanded, setExpanded] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [addPair, { data, loading, error }] = useMutation(ADD_PAIR_MUTATION);

  console.log(data);
  console.log(error);

  const handleAddPair = async () => {
    const id = generateUniqueId();
    createQAEmbedding(question, answer, id);
    await addPair({
      variables: { question, answer, id },
    });

    setQuestion("");
    setAnswer("");
    // handle response, loading, and error as needed
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("/api/hasura/addQA", {
  //       question,
  //       answer,
  //     });
  //     console.log(response.data.message);
  //     setQuestion("");
  //     setAnswer("");
  //   } catch (error) {
  //     console.error("Error adding Q&A pair", error);
  //   }
  // };

  return (
    <div className="flex flex-col mt-2.5 gap-y-4">
      <Input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter Question"
        required
        className="px-4 py-2 border border-gray-300 focus:outline-none rounded-full focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        type="text"
        rows="6"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter Answer"
        required
        className="px-4 py-2 border border-gray-300 focus:outline-none rounded-2xl focus:ring-2 focus:ring-blue-500"
      />
      <Button
        type="primary"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleAddPair}
      >
        Add Pair
      </Button>
    </div>
  );
}
