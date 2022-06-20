const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: `${__dirname}/config.env` });

const DB = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

console.log(DB);

mongoose.connect(DB).then(() => {
  // console.log(con.connections);
  console.log("DB connection successfull!");
});

// const quiz = new Quiz({
//   key: "HTML",
//   quizGroup: [
//     {
//       name: "HTML (1)",
//       level: 1,
//       difficulty: "medium",
//     },
//   ],
// });

app.listen(80, () => {
  console.log("Listening on port 80");
});
