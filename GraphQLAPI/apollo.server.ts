import { readFile } from "fs/promises";

import { ApolloServer } from "apollo-server-express";

import resolvers from "./resolvers.js";
import console from "../utils/console.js";

async function startApolloServer() {
  const typeDefs = await readFile(`${__dirname}/schema.graphql`, "utf-8");

  //@ts-ignore
  const context = ({ req }) => ({
    user: req.user,
  });

  const apolloServer = new ApolloServer({ typeDefs, resolvers, context });

  await apolloServer.start();

  return apolloServer;
}

export default startApolloServer;
