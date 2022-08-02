import { readFile } from "fs/promises";

import { ApolloServer } from "apollo-server-express";

import resolvers from "./resolvers.js";
import console from "../utils/console.js";
import AppError from "../ErrorHandling/AppError.js";
import isProductionEnvironment from "../utils/isProductionEnvironment.js";

async function startApolloServer() {
  const typeDefs = await readFile(`${__dirname}/schema.graphql`, "utf-8");

  //@ts-ignore
  const context = ({ req }) => ({
    user: req.user,
  });

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    formatError: (err) => {
      if (isProductionEnvironment()) {
        delete err.extensions["exception"].stacktrace;
      }

      return err;
    },
  });

  await apolloServer.start();

  return apolloServer;
}

export default startApolloServer;
