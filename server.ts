import "reflect-metadata";
import * as dotenv from "dotenv";
import getEnv, { EnvEnumType } from "./env/getEnv";
dotenv.config({ path: `${__dirname}/config.env` });
import mongoose from "mongoose";
import app from "./app";
import console from "./utils/console";
import isAllResourcesReady from "./ResourcesVerify/verifyAll";
import isProductionEnvironment from "./utils/isProductionEnvironment";
import logger from "./utils/logger";

//////////////////////////////////////////////////////////////////////
// NOTE :
// IMPORTANT: Just executes async but without waiting ...
// (async () => {
//   let text = await fs.promises.readFile(`${__dirname}/README.md`);
// })();
//////////////////////////////////////////////////////////////////////

console.log("\n\n******************************************\n\n");
console.log(process.env.ENV);
console.log(process.env.PORT);

const isAllReady = isAllResourcesReady();

if (!isAllReady) {
  console.log("setShowVerify");
  console.setShowVerify();
  isAllResourcesReady();
}

if (isAllReady) {
  //#region  DB Connect
  const DB =
    getEnv(EnvEnumType.DATABASE_URL)
      ?.toString()
      .replace(
        "<password>",
        getEnv(EnvEnumType.DATABASE_PASSWORD)?.toString() || ""
      ) || "";

  if (!(DB.indexOf("_MODE_") > -1)) {
    console.log("_MODE_ doesnot exists in the config.env");
    logger.resourceNotFoundError("_MODE_ doesnot exists in the config.env");
  } else {
    mongoose
      .connect(DB)
      .then((con) => {
        // console.log(con.connections);
        console.log("DB connection successfull!\n");
      })
      .catch((err) => {
        console.log("\nDB Connection Error \n", err);
      });
    //#endregion

    //#region  listen

    app.listen(getEnv(EnvEnumType.PORT), () => {
      console.log("\n\n\n******** NODE SERVER STARTED *************\n\n");
      console.log("Listening on port 80");
      console.log("GrapQL Url :", "http://localhost/graphql");
      console.log("isProduction", isProductionEnvironment());
    });
    //#endregion
  }
}
