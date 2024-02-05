import { useState, useEffect } from "react";
import { createEmbedding } from "@/utils";
import { createQAEmbedding, generateUniqueId } from "@/utils";
import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";
import ExistingQA from "@/components/existing-qa";

import { Button, Input, Checkbox, Box } from "@/components/ui";
import { useMutation, gql } from "@apollo/client";

const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "3bacdd76-4962-4cdb-8441-5792a0e2c37e",
});

const ADD_PAIR_MUTATION = gql`
  mutation AddPair($question: String!, $answer: String!) {
    insert_pairs_one(object: { question: $question, answer: $answer }) {
      id
    }
  }
`;

const HomePage = () => {
  const [addPair, { data, loading, error }] = useMutation(ADD_PAIR_MUTATION);

  const [step, setState] = useState(1);
  const [question, setQuestion] = useState("");
  const [suggestedQuestion, setSuggestedQuestion] = useState("");
  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [saveAnswer, setSaveAnswer] = useState(true);

  // loading state
  const [fetchingSimilar, setFetchingSimilar] = useState(false);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [regeneratingAnswer, setRegeneratingAnswer] = useState(false);
  const [sendingAnswer, setSendingAnswer] = useState(false);

  const fetchSimilarAnswers = async () => {
    setFetchingSimilar(true);
    const emb = await createEmbedding(question);

    const index = pinecone.index("questions");
    const queryResponse = await index.query({
      vector: emb,
      topK: 1,
      includeMetadata: true,
    });

    console.log(queryResponse);
    console.log(queryResponse.matches[0].metadata.answer);
    setSuggestedAnswer(queryResponse.matches[0].metadata.answer);
    setSuggestedQuestion(queryResponse.matches[0].metadata.question);
    setFetchingSimilar(false);
  };

  const generateAnswer = async () => {
    try {
      const prompt = `
На основе представленных данных дайте прямой и конкретный ответ на вопрос пользователя, избегая лишних размышлений или деталей. В ответе учитывайте только ключевую информацию из тезисов куратора и схожей пары вопрос-ответ из Pinecone.

1. Вопрос пользователя: "${question}"
2. Тезисы от куратора: "${customInstructions}"
3. Схожая пара вопрос-ответ из Pinecone: 
   Вопрос:  "${suggestedQuestion}"
   Ответ: "${suggestedAnswer}"
`;

      // Use this 'instructions' variable as your prompt for the completion endpoint.
      const response = await axios.post("/api/openai/generate-answer", {
        prompt,
      });
      console.log(response);
      setFinalAnswer(response.data.answer);
    } catch (error) {
      console.error("Error generating answer", error);
      setFinalAnswer("Error generating answer.");
    }
  };

  const sendAnswer = async () => {
    setSendingAnswer(true);
    // Use the utility function to add Q&A to Hasura and Pinecone
    if (saveAnswer) {
      const id = generateUniqueId();
      createQAEmbedding(question, finalAnswer, id);
      await addPair({
        variables: { question, answer: finalAnswer, id },
      });
    }
    alert(`Answer sent ${saveAnswer ? "and saved." : ""} `);
    setSendingAnswer(false);
  };

  return (
    <div className="flex w-full justify-between p-4">
      <div className="flex flex-col gap-y-8 divide-y divide-slate-300 max-w-xl">
        {/* 1. Just question */}
        {step > 0 && (
          <div className="flex flex-col">
            <div className="flex gap-x-1">
              <Input
                placeholder="What do you want to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button
                loading={fetchingSimilar}
                type={step === 1 ? "primary" : "subtle"}
                onClick={async () => {
                  await fetchSimilarAnswers();
                  setState(2);
                }}
                size="sm"
              >
                Ask
              </Button>
            </div>
            {/* Question examples */}
          </div>
        )}
        {/* 2. Suggested answer and custom instructions */}
        {step > 1 && (
          <div className="flex flex-col pt-8 gap-y-3">
            <Box>{suggestedAnswer || "Fetching similar answers..."}</Box>
            <textarea
              placeholder="Custom instructions"
              className="py-2 px-3 rounded-2xl border border-gray-300 w-56 w-full"
              rows={8}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
            />
            <Button
              loading={generatingAnswer || regeneratingAnswer}
              type={step === 2 ? "primary" : "subtle"}
              onClick={async () => {
                setGeneratingAnswer(true);
                await generateAnswer();
                setGeneratingAnswer(false);
                setState(3);
              }}
            >
              Generate answer
            </Button>
          </div>
        )}
        {/* 3. Final answer (and regenerate) */}
        {step > 2 && (
          <div className="flex flex-col pt-8 gap-y-3">
            <Box>{finalAnswer || "Generated answer will appear here"}</Box>
            <div className="flex flex-col gap-y-1.5">
              <Button
                type="secondary"
                loading={generatingAnswer || regeneratingAnswer}
                onClick={async () => {
                  setRegeneratingAnswer(true);
                  await generateAnswer();
                  setRegeneratingAnswer(false);
                }}
              >
                Regenerate answer
              </Button>
              <Button
                type="primary"
                onClick={sendAnswer}
                loading={sendingAnswer}
              >
                Send
              </Button>
              <Checkbox
                label="Save answer"
                value={saveAnswer}
                onChange={() => setSaveAnswer(!saveAnswer)}
              />
            </div>
          </div>
        )}
      </div>
      <ExistingQA />
    </div>
  );
};

export default HomePage;
