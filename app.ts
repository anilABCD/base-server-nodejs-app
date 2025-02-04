// @ts-ignore
import { rateLimit } from "express-rate-limit";

// @ts-ignore
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";
import hpp from "hpp";
import morgan from "morgan";
import errorController from "./ErrorHandling/error.controller";
import AppError from "./ErrorHandling/AppError";
import isProductionEnvironment from "./utils/isProductionEnvironment";

import messagesRouter from "./routes/developerDating/chats";

import matchesRouter from "./routes/developerDating/matchs";

import rejectedRouter from "./routes/developerDating/rejectedUsers";

import interactionsRouter from "./routes/developerDating/interactions";

import profileRouter from "./routes/developerDating/profiles";

// import startApolloSevrver from "./GraphQLAPI/apollo.server";
import { graphqlUploadExpress } from "graphql-upload";

// import webpush from "web-push";
// for : /graphql
import AuthController from "./controllers/user.controllers/auth.controller";
import cors from "cors";
import { FileParams } from "./utils/File";

import File from "./utils/File";

import { ExpressPeerServer } from "peer";

//////////////////////

import { promisify } from "util";

import path from "path";

// import "./GraphQLAPI/tutorial/apollo-turorial";
// import { graphqlHTTP } from "express-graphql";

// const sampleRouter = require("./routes/sample.router");

import quizeCategoryRouter from "./routes/quize.app/quize.routes/quize.category.router";
import quizeNameRouter from "./routes/quize.app/quize.routes/quize.name.router";
import quizeQuestionRouter from "./routes/quize.app/quize.routes/quize.question.router";
import authRouter from "./routes/user.routes/user.router";
import schema from "./GraphQLAPI/tutorial/at-app-ts.schema";

//@ts-ignore
import cookies from "cookie-parser";
// import generateRouter from "./routes/generate.routes/generate.router";
import getEnv, { EnvEnumType } from "./env/getEnv";
import isCurrentApp from "./utils/isCurrentApp";
// import console from "./utils/console";
import isOnlyDevelopmentEnvironment from "./utils/isOnlyDevelopmentEnvironment";
import isOnlyTestEnvironment from "./utils/isOnlyTestingEnvironment";
import express, { application } from "express";
import generateRouter from "./routes/generate.routes/generate.router";
import googleRouter from "./routes/google/google.router";
import facebookRouter from "./routes/facebook/facebook.router";
import groupsRouter from "./routes/messaging.app/routers/groups.router";
import eventRouter from "./routes/messaging.app/routers/events.router";
import userRouter from "./routes/messaging.app/routers/user.routes";
import AuthService from "./services/user.services/auth.service";
import User from "./Model/user.models/user.model";

const likesRouter = require("./routes/developerDating/likes");

const notificationsRouter = require("./routes/notification.device.routes/notification.device.router");

let authService = new AuthService(User);

let authController = new AuthController(authService);

const limiter = rateLimit({
  max: 120,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP , Please try again in a hour",
});

const app = express();

// Enable "trust proxy" when behind a reverse proxy
app.enable("trust proxy");
// Enable "trust proxy" when behind a reverse proxy
app.set("trust proxy", 1);

const toUseTopLevelAwait = promisify(() => true);

toUseTopLevelAwait().then((_result) => {});

// startApolloSevrver().then((apolloServer) => {
//#region  EJS
// // View Engine
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// // index page
// app.get("/", function (req, res) {
//   res.render("index");
// });
//#endregion

////// i dont know about this :
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });
//////////////////////////

// Request logger
app.use(morgan("dev"));

// 1) Setting Security HTTP Headers
if (isProductionEnvironment()) app.use(helmet());

// 2) Rate Limiter
if (isProductionEnvironment()) app.use(limiter);

// 3) Cookies Parser
app.use(cookies());

// 4) JSON Body Parser + Data Limiter
app.use(express.json({ limit: "10kb" }));

// 5) Url Encoded
app.use(express.urlencoded({ extended: true }));

// 6) Data Sanitization
app.use(mongoSanitize());

// 7) Data sanitization against xss
app.use(xss());

// 8) Preventing parameter pollution
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

//#region V1

//#region Static Files

app.use(express.static(__dirname + "/public"));

// Example route
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

//#endregion End Static Files

// cors

var corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "https://www.developerext.com",
    "https://developerext.com",
    "http://192.168.1.4:8000",
    "http://192.168.1.2:8000",
    "http://0.0.0.0:8000",
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use("*", cors(corsOptions));

///////

//#region  Graph QL

// app.use(
//   "/v1/graphql",
//   graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//   })
// );

//#endregion End Graph QL

if (isCurrentApp("quize-app")) {
  //#region  Quize Api ...
  // app.use("/api/v1/sampleRoute/", sampleRouter);
  // app.use("/api/v1/quize-category/", quizeCategoryRouter);
  // app.use("/api/v1/quize-name/", quizeNameRouter);
  // app.use("/api/v1/quize-question/", quizeQuestionRouter);
  // app.get("/api/v1/", (req, res, next) => {
  //   res.status(200).send("<h1>Hello World</h1>");
  // });
  //#endregion End Quize Api
}

// let webPushVapidKeys = {
//   publicKey:
//     "BItsr9CWH8QtZW6lsoVdj4V6of9OnoYlLTyhoJtLmkXRIPTY2CxdnrfHWDVArJPZi4kwybD9Fbh-mwCcXJgapXs",
//   privateKey: "FsyfVne4UPEIJJ4Rssyq3g6YLggm1XVOPTpNigT7NbU",
// };

// webpush.setVapidDetails(
//   "mailto:786.anil.potlapally@gmail.com",
//   webPushVapidKeys.publicKey,
//   webPushVapidKeys.privateKey
// );

// app.post("/subscribe", (req, res) => {
//   const subscription = req.body;

//   res.status(201).json({});

//   // Create payload

//   const payload = JSON.stringify({ title: "push test" });

//   webpush
//     .sendNotification(subscription, payload)
//     .catch((err) => console.log(err));
// });

// Generate GraphQL for Current Application ...

if (isOnlyDevelopmentEnvironment() || isOnlyTestEnvironment()) {
  // useless generator ...
  // app.use("/api/v1/generate/", generateRouter);
}

///////////////

/// social ///

app.use("/google", googleRouter);

app.use("/facebook", facebookRouter);

/////////////

//#region User Api

app.use("/auth/", authRouter);
app.use("/user/", authController.protect, authRouter);

app.use("/groups/", authController.protect, groupsRouter);

app.use("/events/", authController.protect, eventRouter);

app.use("/messages/", authController.protect, messagesRouter);

app.use("/matches/", authController.protect, matchesRouter);

app.use("/interactions/", interactionsRouter);

app.use("/rejections/", authController.protect, rejectedRouter);

app.use("/profiles/", authController.protect, profileRouter);

app.use("/likes/", authController.protect, likesRouter);

app.use("/notifications/", authController.protect, notificationsRouter);

// // Serve static images with authentication
// app.use('/images/', authController.protect, express.static(path.join(__dirname, 'images')));


//#endregion End User Api

//#region Apollo GraphQL

// app.post("/graphql", authController.protectGrqphQL);
// app.use(
//   // "/graphql",
//   // graphqlUploadExpress({ maxFileSize: 30000, maxFiles: 2 })
//   graphqlUploadExpress()
// );
// apolloServer.applyMiddleware({ app, path: "/graphql" });

//#endregion End Apollo GraphQL

//#endregion V1

// Final Operational/Non Operational Error Handling ...
app.use(errorController);
// });

// console.log(app);

export default app;
