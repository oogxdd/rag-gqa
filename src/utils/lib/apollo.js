// apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_URL, // Replace with your Hasura HTTP endpoint
  headers: {
    "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_SECRET, // Replace with your Hasura admin secret
  },
});

const wsLink = new WebSocketLink({
  uri: process.env.NEXT_PUBLIC_HASURA_WS_URL, // Replace with your Hasura WebSocket endpoint
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_SECRET, // Replace with your Hasura admin secret
      },
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
