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

// 4) Data Sanitization
app.use(mongoSanitize());

// 5) Data sanitization against xss
app.use(xss());

// 6) Preventing parameter pollution
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

const sampleRouter = require("./routes/sampleRouter");
import quizeCategoryRouter from "./routes/quize-routes/quize.category.router";

app.use("/sampleRoute/", sampleRouter);
app.use("/quize-category/", quizeCategoryRouter);

app.get("/", (req, res, next) => {
  res.status(200).send("<h1>Hello World</h1>");
});

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
