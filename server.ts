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

import * as mongodb from "mongodb";
const { ExpressPeerServer } = require("peer");
import { Server } from "socket.io";
import AppError from "./ErrorHandling/AppError";
import AuthController from "./controllers/user.controllers/auth.controller";
import IUser from "./interfaces/user.interfaces/user.interface";

//////////////////////////////////////////////////////////////////////
// NOTE :
// IMPORTANT: Just executes async but without waiting ...
// (async () => {
//   let text = await fs.promises.readFile(`${__dirname}/README.md`);
// })();
//////////////////////////////////////////////////////////////////////

const PORT = getEnv(EnvEnumType.PORT);
let db: mongodb.Db;
let client: mongodb.MongoClient;
console.log("\n\n******************************************\n\n");
console.log(process.env.ENV);
console.log(PORT);

const isAllReady = isAllResourcesReady();

let authController = new AuthController();

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

    client = new mongodb.MongoClient(DB);

    client
      .connect()
      .then((response) => {
        console.log("connected db");
      })
      .catch((err) => {
        console.log("error db connect", err);
      });

    db = client.db();

    //#endregion

    //#region listen
    var server = require("http").createServer(app);
    server.listen(PORT, () => {
      console.log("\n\n\n******** NODE SERVER STARTED *************\n\n");
      console.log("Listening on port : " + PORT);

      console.log("PeerJs Url :", "http://localhost:" + PORT + "/peerjs/");

      console.log("isProduction", isProductionEnvironment());
    });

    const customGenerationFunction = () =>
      (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

    const peerServer = ExpressPeerServer(server, {
      debug: true,
      path: "/",
      generateClientId: customGenerationFunction,
    });

    app.use("/peerjs", peerServer);

    // #region Peer Server

    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connect", (socket) => {
      // below is room Code ::::::::::::::::::::::::::::::::
      console.log("connected");
      // socket.on("join-general-room", (params) => {
      //   console.log("room-id", params);
      //   socket.join(params);
      // });

      // socket.on("user-exists", async ({ user, socketID }: any) => {
      //   let userInfo = await db
      //     .collection("active-chats")
      //     .findOne({ email: user.email });
      //   console.log("on user-exists");

      //   console.log(userInfo);

      //   io.in(socketID).emit("user-found", userInfo);
      //   console.log("user-found emitted", socketID);
      // });

      // socket.on(
      //   "update-user",
      //   async ({ user, socketID: socketID, allUserRoomID }: any) => {
      //     socket.join(allUserRoomID);

      //     let doc = await db.collection("active-chats").findOneAndUpdate(
      //       {
      //         email: user.email,
      //       },
      //       {
      //         $set: { socketID: socketID },
      //       },
      //       {
      //         returnDocument: "after",
      //       }
      //     );

      //     if (doc) {
      //       let allUsers = await db
      //         .collection("active-chats")
      //         .find({})
      //         .toArray();
      //       let otherUsers = allUsers.filter(({ email: otherEmails }) => {
      //         return otherEmails !== user.email;
      //       });

      //       io.in(socketID).emit("activeUsers", otherUsers);
      //     }

      //     socket
      //       .to(allUserRoomID)
      //       .emit("new-user-join", [{ ...user, socketID }]);
      //   }

      //   //** Notify other user about updated or joined users */
      // );
      // socket.on("user-join", async ({ allUserRoomID, user, socketID }) => {
      //   socket.join(allUserRoomID);

      //   //* Store new user in active chats */

      //   let activeUser = await db
      //     .collection("active-chats")
      //     .findOne({ email: user.email });

      //   if (!activeUser) {
      //     const active = await db.collection("active-chats").insertOne({
      //       ...user,
      //       socketID,
      //     });

      //     const users = await db.collection("active-chats").find({}).toArray();

      //     let otherUsers = users.filter(
      //       ({ email: otherEmails }) => otherEmails !== user.email
      //     );

      //     // ** Send others to new connected user

      //     io.in(socketID).emit("activeUsers", otherUsers);
      //   } else {
      //     //inc yesterday.
      //     // Emit to all other users the last joined user

      //     socket.to(allUserRoomID).emit("new-user-joined", user);
      //   }
      // });

      // // Listen for peer connections

      // socket.on(
      //   "join-stream-room",
      //   ({ roomID, peerID, socketID, user }: any) => {
      //     socket.join(roomID);

      //     socket.to(roomID).emit("user-connected", {
      //       peerID,
      //       user,
      //       roomID,
      //       socketID,
      //     });
      //   }
      // );

      // Above is room code ::::::::::::::::::::::::::::::::

      /////////////////// chat gpt user to user communication code ///////////

      console.log("New client connected:", socket.id);

      socket.on("joinRoom", (userId) => {
        console.log(`Socket ${socket.id} joined user room ${userId}`);
        socket.join(userId);
      });

      socket.on("sendMessage", ({ userId, message }) => {
        console.log("Received new message:", message);
        // Save the message to the database

        // Emit the new message event to the user room
        io.to(userId).emit("newMessage", message);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      // Above is chat gpt user to user communication code . ///////////
    });

    io.use(async (socket, next) => {
      const token = socket.handshake.query.token as string;

      let validateToken = await authController.protectSocket(token);
      if (validateToken.success == true) {
        // Authentication successful

        //@ts-ignore
        socket.user = validateToken.user;

        //@ts-ignore
        console.log(" Authentication ", validateToken.message, socket.user);

        return next();
      }

      console.log("Error Authentication :", validateToken.message);
      return next(new AppError(validateToken.message, 401));
    });

    // 404 NOTE: all("*") : get, post, patch , delete All URLs .
    app.all("*", (req, res, next) => {
      // res.status(404).json({
      //   status: "fail",
      //   message: `Can't find ${req.originalUrl} on this server.`,
      // });
      next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
    });

    //
    // Sample Link :
    // http://localhost:5000/peerjs/dating.kairo
    //

    // #endregion Peer Server ....

    //#endregion
  }
}

export { db, client };
