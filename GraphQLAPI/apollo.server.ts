import { readFile } from "fs/promises";

import { ApolloServer } from "apollo-server-express";

// import resolvers from "./quize.app/resolvers.js";

import console from "../utils/console.js";
import AppError from "../ErrorHandling/AppError.js";
import isProductionEnvironment from "../utils/isProductionEnvironment.js";
import getEnv, { EnvEnumType } from "../env/getEnv.js";

async function startApolloServer() {
  // const typeDefs = await readFile(
  //   `${__dirname}/quize.app/schema.graphql`,
  //   "utf-8"
  // );

  const CURRENT_APP = getEnv(EnvEnumType.CURRENT_APP) || "";

  const pathForCurrentApp = CURRENT_APP?.replace("-", ".");

  let currentProjectTypeDefs = await readFile(
    `${__dirname}/${pathForCurrentApp}/schema.graphql`,
    "utf-8"
  );

  let currentProjectResolvers =
    require(`${__dirname}/${pathForCurrentApp}/resolvers.js`).default;

  // console.log(currentProjectResolvers);
  // console.log(currentProjectTypeDefs);

  const typeDefs = currentProjectTypeDefs;
  const resolvers = currentProjectResolvers;

  // console.log(typeDefs);

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
