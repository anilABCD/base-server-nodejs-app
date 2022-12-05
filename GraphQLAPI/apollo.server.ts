import { readFile } from "fs/promises";

import { ApolloServer } from "apollo-server-express";

// import resolvers from "./quize.app/resolvers.js";

import console from "../utils/console.js";
import AppError from "../ErrorHandling/AppError.js";
import isProductionEnvironment from "../utils/isProductionEnvironment.js";
import getEnv, { EnvEnumType } from "../env/getEnv.js";
import File, { FileParams } from "../utils/File.js";

async function startApolloServer() {
  // const typeDefs = await readFile(
  //   `${__dirname}/quize.app/schema.graphql`,
  //   "utf-8"
  // );

  const CURRENT_APP = getEnv(EnvEnumType.CURRENT_APP) || "";

  const pathForCurrentApp = CURRENT_APP?.replace(/-/g, ".");

  // let currentProjectTypeDefs = await readFile(
  //   `${__dirname}/${pathForCurrentApp}/schema.graphql`,
  //   "utf-8"
  // );

  const fileParams: FileParams = {
    namesOf: "file",
  };

  let fileNamesTypeDefs = File.getDirectoryOrFileNamesSync(
    [`${__dirname}/${pathForCurrentApp}`],
    fileParams,
    ["graphql"]
  );

  let currentProjectTypeDefs = File.getFilesDataSync(
    fileNamesTypeDefs,
    ["graphql"],
    []
  );

  // console.log(fileNamesTypeDefs, "typedefs filenames");

  let currentProjectResolvers =
    require(`${__dirname}/${pathForCurrentApp}/resolvers.js`).default;

  console.log(currentProjectResolvers);
  console.log(currentProjectTypeDefs, "new");

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
    csrfPrevention: true,

    context,
    formatError: (err) => {
      console.log("formatError apollo server ", err);
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
