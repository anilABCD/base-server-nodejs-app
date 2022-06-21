import * as dotenv from "dotenv";

import mongoose from "mongoose";
import app from "./app";

dotenv.config({ path: `${__dirname}/config.env` });

const DB =
  process.env?.DATABASE_URL?.replace(
    "<password>",
    process.env.DATABASE_PASSWORD || ""
  ) || "";

mongoose.connect(DB).then(() => {
  // console.log(con.connections);
  console.log("DB connection successfull!");
});

app.listen(80, () => {
  console.log("Listening on port 80");
});
