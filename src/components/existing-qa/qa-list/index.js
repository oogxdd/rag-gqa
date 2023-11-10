import { useSubscription, useQuery, gql } from "@apollo/client";

const PAIRS_SUBSCRIPTION = gql`
  subscription {
    pairs {
      id
      question
      answer
    }
  }
`;

const QAList = () => {
  const { data, loading, error } = useSubscription(PAIRS_SUBSCRIPTION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data);

  return (
    <div className="flex flex-col gap-y-2.5">
      {data.pairs.map((qa, index) => (
        <QAPair qa={qa} key={index} />
      ))}
    </div>
  );
};

const QAPair = ({ qa }) => (
  <div className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200">
    <div className="px-2.5 py-3 border-b border-gray-200">
      <b>Q:</b>
      <span className="ml-1">{qa.question}</span>
    </div>
    <div className="px-2.5 py-3">
      <b>A:</b>
      <span className="ml-1">{qa.answer}</span>
    </div>
  </div>
);

export default QAList;
