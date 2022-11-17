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
import TypeDevMode from "./enums/TypeDevMode";
import isOnlyDevelopmentEnvironment from "./utils/isOnlyDevelopmentEnvironment";

const { ExpressPeerServer } = require("peer");

//////////////////////////////////////////////////////////////////////
// NOTE :
// IMPORTANT: Just executes async but without waiting ...
// (async () => {
//   let text = await fs.promises.readFile(`${__dirname}/README.md`);
// })();
//////////////////////////////////////////////////////////////////////

const PORT = getEnv(EnvEnumType.PORT);

console.log("\n\n******************************************\n\n");
console.log(process.env.ENV);
console.log(PORT);

const isAllReady = isAllResourcesReady();

if (!isAllReady) {
  console.log("setShowVerify");
  console.setShowVerify();
  isAllResourcesReady();
}

if (isAllReady) {
  //#region  DB Connect

  const CURRENT_APP = getEnv(EnvEnumType.CURRENT_APP) || "";

  let DB_URL =
    getEnv(EnvEnumType.DATABASE_URL)
      ?.toString()
      .replace(
        "<password>",
        getEnv(EnvEnumType.DATABASE_PASSWORD)?.toString() || ""
      ) || "";

  if (
    !(DB_URL.indexOf("[CURRENT_APP]") > -1) ||
    !(DB_URL.indexOf("[DEV_MODE]") > -1) ||
    CURRENT_APP === ""
  ) {
    console.log(
      "[CURRENT_APP] or [DEV_MODE] or getEnv(EnvEnumType.CURRENT_APP) is empty , doesnot exists in the config.env"
    );
    logger.resourceNotFoundError("_MODE_ doesnot exists in the config.env");
  } else {
    let projectMode: TypeDevMode;

    projectMode = "development";

    if (isProductionEnvironment()) {
      projectMode = "production";
    } else if (isOnlyDevelopmentEnvironment()) {
      projectMode = "development";
    }

    DB_URL = DB_URL.replace("[DEV_MODE]", "-" + projectMode);
    DB_URL = DB_URL.replace("[CURRENT_APP]", CURRENT_APP);

    const DB = DB_URL;

    const options = {
      useNewUrlParser: true,

      autoIndex: true, //this is the code I added that solved it all
      keepAlive: true,

      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    mongoose
      .connect(DB, options)
      .then((con) => {
        // console.log(con.connections);
        console.log("DB connection successfull!\n");
      })
      .catch((err) => {
        console.log("\nDB Connection Error \n", err);
      });

    //#endregion

    //#region listen

    const server = app.listen(PORT, () => {
      console.log("\n\n\n******** NODE SERVER STARTED *************\n\n");
      console.log("Listening on port : " + PORT);
      console.log("GrapQL Url :", "http://localhost:" + PORT + "/graphql");
      console.log(
        "GrapQL Url :",
        "http://localhost:" + PORT + "/peerjs/" + CURRENT_APP
      );

      console.log("isProduction", isProductionEnvironment());
    });

    // #region Peer Server

    const peerServer = ExpressPeerServer(server, {
      debug: true,
      path: "/dating.kairo",
    });

    app.use("/peerjs", peerServer);

    //
    // Sample Link :
    // http://localhost:5000/peerjs/dating.kairo
    //

    // #endregion Peer Server ....

    //#endregion
  }
}
