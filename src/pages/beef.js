import { useState } from "react";
export default function Home() {
  const [state, setState] = useState(1);

  return (
    <div className="flex">
      <div className="flex flex-col">
        {/* 1. Just question */}
        <div className="flex flex-col">
          <div className="flex">
            <input placeholder="What do you want to ask?" />
            <Button
              type={state === 1 ? "primary" : "subtle"}
              onClick={() => {
                setState(2);
              }}
            >
              Ask
            </Button>
          </div>
          {/* Question examples */}
        </div>
        {/* 2. Suggested answer and custom instructions */}
        {state > 1 && (
          <div className="flex flex-col">
            <Box>Suggested answer</Box>
            <textarea placeholder="Custom instructions" />
            <Button
              type={state === 2 ? "primary" : "subtle"}
              onClick={() => {
                setState(3);
              }}
            >
              Generate answer
            </Button>
          </div>
        )}
        {/* 3. Final answer (and regenerate) */}
        {state > 2 && (
          <div className="flex flex-col">
            <Box>Final answer</Box>
            <Button type="secondary">Regenerate answer</Button>
            <Button type="primary">Send</Button>
            <Checkbox label="Save answer" value={true} />
          </div>
        )}
      </div>
    </div>
  );
}

const Box = ({ children }) => (
  <div className="flex flex-col border rounded-md">
    {children}
    <span />
  </div>
);

const Button = ({ children }) => <Button>{children}</Button>;
const Checkbox = ({ label = "", value = false }) => (
  <div className="flex">
    <input type="checkbox" value={value} />
    <label>{label}</label>
  </div>
);
