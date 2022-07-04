import "reflect-metadata";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import console from "./utils/console";
import getEnv from "./.env/getEnv";
// import "./dependency.injection";
dotenv.config({ path: `${__dirname}/config.env` });

const DB =
  getEnv("DATABASE_URL")
    ?.toString()
    .replace("<password>", getEnv("DATABASE_PASSWORD")?.toString() || "") || "";

mongoose
  .connect(DB)
  .then((con) => {
    // console.log(con.connections);
    console.log("\nDB connection successfull!\n");
  })
  .catch((err) => {
    console.log("\nDB Connection Error \n", err);
  });

app.listen(80, () => {
  console.log("Listening on port 80");
});
