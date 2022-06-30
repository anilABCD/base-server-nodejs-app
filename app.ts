import { rateLimit } from "express-rate-limit";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
import errorController from "./ErrorHandling/error.controller";
import AppError from "./ErrorHandling/AppError";

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP , Please try again in a hour",
});

const app = express();

// Request logger
app.use(morgan("dev"));

// 1) Setting Security HTTP Headers
app.use(helmet());

// 2) Rate Limiter
app.use(limiter);

// 3) JSON Body Parser + Data Limiter
app.use(express.json({ limit: "10kb" }));

// 4) Url Encoded
app.use(express.urlencoded({ extended: true }));

// 5) Data Sanitization
app.use(mongoSanitize());

// 6) Data sanitization against xss
app.use(xss());

// 7) Preventing parameter pollution
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

// const sampleRouter = require("./routes/sample.router");
import quizeCategoryRouter from "./routes/quize.routes/quize.category.router";
import quizeNameRouter from "./routes/quize.routes/quize.name.router";
import quizeQuestionRouter from "./routes/quize.routes/quize.question.router";

//#region  V1 Quize API ...

// app.use("/api/v1/sampleRoute/", sampleRouter);
app.use("/api/v1/quize-category/", quizeCategoryRouter);
app.use("/api/v1/quize-name/", quizeNameRouter);
app.use("/api/v1/quize-question/", quizeQuestionRouter);

// app.get("/api/v1/", (req, res, next) => {
//   res.status(200).send("<h1>Hello World</h1>");
// });

//#endregion

// 404 NOTE: all("*") : get, post, patch , delete All URLs .
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server.`,
  // });
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// Final Operational/Non Operational Error Handling ...
app.use(errorController);

export default app;
