import "reflect-metadata";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import console from "./utils/console";
// import "./dependency.injection";
dotenv.config({ path: `${__dirname}/config.env` });

// console.log(process.env?.DATABASE_URL);

const DB =
  process.env?.DATABASE_URL?.replace(
    "<password>",
    process.env.DATABASE_PASSWORD || ""
  ) || "";

mongoose
  .connect(DB)
  .then(() => {
    // console.log(con.connections);
    console.log("\nDB connection successfull!\n");
  })
  .catch((err) => {
    console.log("\nDB Connection Error \n", err);
  });

app.listen(80, () => {
  console.log("Listening on port 80");
});
