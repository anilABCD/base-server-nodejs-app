import { readFile } from "fs/promises";

import { ApolloServer } from "apollo-server-express";

import resolvers from "./resolvers.js";

async function startApolloServer() {
  const typeDefs = await readFile(`${__dirname}/schema.graphql`, "utf-8");

  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  await apolloServer.start();

  return apolloServer;
}

export default startApolloServer;
