import "reflect-metadata";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import console from "./utils/console";
import getEnv, { EnvEnumType } from "./env/getEnv";
import isAllResourcesReady from "./ResourcesVerify/verifyAll";
// import "./dependency.injection";
dotenv.config({ path: `${__dirname}/config.env` });

if (isAllResourcesReady()) {
  //#region  DB Connect

  const DB =
    getEnv(EnvEnumType.DATABASE_URL)
      ?.toString()
      .replace(
        "<password>",
        getEnv(EnvEnumType.DATABASE_PASSWORD)?.toString() || ""
      ) || "";
  mongoose
    .connect(DB)
    .then((con) => {
      // console.log(con.connections);
      console.log("\nDB connection successfull!\n");
    })
    .catch((err) => {
      console.log("\nDB Connection Error \n", err);
    });
  //#endregion

  //#region  listen

  app.listen(getEnv(EnvEnumType.PORT), () => {
    console.log("\nListening on port 80");
  });
  //#endregion
}
