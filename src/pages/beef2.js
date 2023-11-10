import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [step, setState] = useState(1);
  const [question, setQuestion] = useState("");
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
    // Implement logic to fetch similar answers
    // Example: const response = await axios.post('/api/fetchSimilarAnswers', { question });
    // setSuggestedAnswer(response.data.answer);
    try {
      const response = await axios.post("/api/pinecone/get", {
        query: question,
      });
      if (response.data && response.data.length > 0) {
        setSuggestedAnswer(response.data[0].answer); // Assuming the response contains an array of {id, answer}
      } else {
        setSuggestedAnswer("No similar answers found.");
      }
    } catch (error) {
      console.error("Error fetching similar answers", error);
      setSuggestedAnswer("Error fetching similar answers.");
    }
    setFetchingSimilar(false);
  };

  const generateAnswer = async () => {
    try {
      const prompt = `${question}\n\nSuggested Answer: ${suggestedAnswer}\n\nCustom Instructions: ${customInstructions}\n\nAnswer:`;
      const response = await axios.post("/api/openai/generate-answer", {
        prompt,
      });
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
      await axios.post("/api/hasura/addQA", { question, answer: finalAnswer });
    }
    alert("Answer sent: " + finalAnswer);
    setSendingAnswer(false);
  };

  return (
    <div className="flex p-4">
      <div className="flex flex-col gap-y-8 divide-y divide-slate-300">
        {/* 1. Just question */}
        {step > 0 && (
          <div className="flex flex-col">
            <div className="flex gap-x-1">
              <input
                placeholder="What do you want to ask?"
                className="py-1 px-3 rounded-full border border-gray-300 w-56"
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
              loading={generatingAnswer}
              type={step === 2 ? "primary" : "subtle"}
              onClick={() => {
                setGeneratingAnswer(true);
                generateAnswer();
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
                loading={regeneratingAnswer}
                onClick={async () => {
                  setRegeneratingAnswer(true);
                  generateAnswer();
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
    </div>
  );
}

const Box = ({ children }) => (
  <div className="bg-gray-50 rounded-2xl flex flex-col border p-4">
    {children}
  </div>
);

const Button = ({ children, type, onClick, loading, size = "default" }) => {
  let className = "";
  let sizeClassName = "py-2 px-4";

  if (type === "primary") {
    className = "bg-blue-700 text-white";
  }

  if (type === "secondary") {
    className = "bg-amber-300 text-gray-900";
  }

  if (type === "subtle") {
    className = "bg-gray-50 text-gray-700 border-gray-300 border";
  }

  if (size === "sm") {
    sizeClassName = "py-1 px-4";
  }

  return (
    <button
      className={`rounded-full ${sizeClassName} ${className} hover:opacity-80`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

const Checkbox = ({ label, value, onChange }) => (
  <div className="flex items-center ml-0 cursor-pointer hover:opacity-90">
    <input
      type="checkbox"
      checked={value}
      onChange={onChange}
      name="save-answer"
      className="h-4 w-4 rounded border-gray-300 text-blue-500 cursor-pointer"
    />
    <label
      className="ml-1.5 text-gray-700 text-sm cursor-pointer"
      htmlFor="save-answer"
      onClick={onChange}
    >
      {label}
    </label>
  </div>
);
