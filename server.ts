import "reflect-metadata";
import * as dotenv from "dotenv";
import getEnv, { EnvEnumType } from "./env/getEnv";
dotenv.config({ path: `${__dirname}/config.env` });
import mongoose from "mongoose";
import app from "./app";
import otherConsole from "./utils/console";
import isAllResourcesReady from "./ResourcesVerify/verifyAll";
import isProductionEnvironment from "./utils/isProductionEnvironment";
import logger from "./utils/logger";
import TypeDevMode from "./enums/TypeDevMode";
import isOnlyDevelopmentEnvironment from "./utils/isOnlyDevelopmentEnvironment";
const os = require("os");
import * as mongodb from "mongodb";
const { ExpressPeerServer } = require("peer");
import { Server } from "socket.io";
import AppError from "./ErrorHandling/AppError";
import AuthController from "./controllers/user.controllers/auth.controller";
import IUser from "./interfaces/user.interfaces/user.interface";
import AuthService from "./services/user.services/auth.service";
import User from "./Model/user.models/user.model";
import path from "path";
import { extractObjectId } from "./utils/extractObjectId";
const fs = require('fs');
const Chat = require("./Model/deverloperDating/chat")
const { ObjectId } = require('mongodb'); // Import ObjectId if needed

// const { HubConnectionBuilder, LogLevel } = require("@microsoft/signalr");

// Store mapping of userId to socket.id
let users : any = {};


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

let service = new AuthService(User);
let authController = new AuthController(service);

if (!isAllReady) {
  console.log("setShowVerify");

  otherConsole.setShowVerify();

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

    console.log();
    console.log(DB);

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

    Chat.syncIndexes();

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

    // Function to get local IP address
    const getLocalIPAddress = () => {
      const interfaces = os.networkInterfaces();
      for (let interfaceName in interfaces) {
        for (let interfaceInfo of interfaces[interfaceName]) {
          if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
            return interfaceInfo.address;
          }
        }
      }
      return "localhost";
    };

    //#region listen
    var server = require("http").createServer(app);

    const localIPAddress = getLocalIPAddress();

    server.listen(PORT, "0.0.0.0", () => {
      console.log("\n\n\n******** NODE SERVER STARTED *************\n\n");
      console.log("Listening on port : " + PORT);

      console.log(
        "PeerJs Url :",
        `http://${getLocalIPAddress()}:` + PORT + "/peerjs/"
      );

      console.log("isProduction", isProductionEnvironment());
    });

    const customGenerationFunction = () =>
      (Math.random().toString(36) + "0000000000000000000").substr(2, 16);



// ///////////////////////////////////////////////////////////////// SIGNALR START //////////////////////////////////
 
// const connection = new HubConnectionBuilder()
//   .withUrl(`${process.env.SIGNALR_ENDPOINT}/?hub=ChatHub`, {
//     accessTokenProvider: () => {
//       const token = process.env.SIGNALR_ACCESS_TOKEN; 
//       if (!token) {
//         console.error("Access token is missing or empty.");
//         return Promise.reject(new Error("Missing access token")); 
//       }
//       return Promise.resolve(token);
//     }
//   })
//   .configureLogging(LogLevel.Information)
//   .build();
// console.log(`${process.env.SIGNALR_ENDPOINT}/?hub=ChatHub`);

// (async () => {
//   try {
//     await connection.start();
//     console.log("SignalR connected."); 
//   } catch (error:any) {
//     console.error("Error connecting to SignalR:", error); 
//     console.error("Error details:", error.statusCode, error.message); // Log more details
//   }
// })();

// // Join a room
// app.post("/join-room", async (req, res) => {
//   const { roomName, userId } = req.body;

//   if (!roomName || !userId) {
//     return res.status(400).send({ error: "Room name and user ID are required." });
//   }

//   try {
//     await connection.invoke("JoinRoom", roomName, userId);
//     res.status(200).send({ message: `User ${userId} joined room ${roomName}` });
//   } catch (error) {
//     console.error("Error joining room:", error);
//     res.status(500).send({ error: "Failed to join room." });
//   }
// });

// // Send a message to a room
// app.post("/send-message", async (req, res) => {
//   const { roomName, message } = req.body;

//   if (!roomName || !message) {
//     return res.status(400).send({ error: "Room name and message are required." });
//   }

//   try {
//     await connection.invoke("SendMessageToRoom", roomName, message);
//     res.status(200).send({ message: `Message sent to room ${roomName}` });
//   } catch (error) {
//     console.error("Error sending message to room:", error);
//     res.status(500).send({ error: "Failed to send message." });
//   }
// });

// ///////////////////////////////////////////////////////////////// END SIGNALR //////////////////////////////////

    const peerServer = ExpressPeerServer(server, {
      debug: true,
      path: "/",
     
      generateClientId: customGenerationFunction,
    });

    app.use("/peerjs", peerServer);

    // #region Peer Server

    const io = new Server(server, {  maxHttpBufferSize: 1e8 /* 100MB */ , cors: { origin: "*" } });

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

        // Register user with their userId and socket.id
       socket.on('registerUser', (userId) => {

           //@ts-ignore
           users[socket.user.id] = socket.id;
           console.log(`User ${userId} connected with socketId: ${socket.id}`);

           console.log(users)
       });

      // socket.on("joinRoom", (userId) => {
      //   console.log(`Socket ${socket.id} joined user room ${userId}`);
      //   socket.join(userId);
      // });

        // Join a one-to-one chat room
  
    socket.on('joinChat', (chatId ) => {

          socket.join(chatId);
          console.log(`User joined chat room: ${chatId}`);
        
    });

   
    socket.on('messageReceieved', async ({ receiverByUserId , sender, timestamp }) => {


      try {
        // Sort participants to match the schema's structure 
        //@ts-ignore
        let participants = [socket.user.id, sender].sort();

        console.log( "received" , sender, timestamp)

  
    // Retrieve the chat document
    let chat = await Chat.findOne({ participants });

    if (!chat) {
        throw new Error("Chat not found");
    }

    // Mark messages as delivered
    chat.messages.forEach((msg : any) => {
        if (
            extractObjectId( msg.sender ) === sender && // Messages sent by the sender
            new Date(msg.timestamp) <= new Date(timestamp) && // Messages sent on or before the timestamp
            !msg.delivered // Only update if not already delivered
        ) {
            msg.delivered = true;
        }
        else {
           console.log("delivered updationg realted" , msg , sender , msg.timestamp , timestamp)
        }
    });


// Update read receipts for the requesting user
const unreadMessages = chat.messages.filter(
  (message:any) => !message.readBy.includes(receiverByUserId)
);

 console.log("unreadMessages" , unreadMessages)

// const unreadMessages = chat.messages
if (unreadMessages.length > 0) {

  unreadMessages.forEach((message:any) => {
    // Check if the user is already in the readBy array

    if (!message.readBy.includes(receiverByUserId)) {      
      message.readBy.push(receiverByUserId); // Mark as read by the user
    }
 

 // Remove null values from the readBy array
    message.readBy = message.readBy.filter( ( user : any ) => user !== null);


  });

  console.log("unreadMessages" , unreadMessages)


    }
      // Use Map's set method to modify the unread count for the recipient

      //@ts-ignore
      chat.unreadCounts.set(socket.user.id, 0);



    // Save the updated chat document
    await chat.save();

        console.log("Messages marked as delivered.");

      // Broadcast the message to all users in the room (chatId)


      let message = { 
          //@ts-ignore
          receiver : socket.user.id,
          timestamp : timestamp,
      }


       if( users[sender]) {

         
         io.to(users[sender]).emit('messageDelivered', message);


       }


    } catch (error:any) {
        console.error("Error marking messages as delivered:", error.message);
    }
 
console.log("Messages marked as delivered.");
 
});


socket.on('sendMessage', async ({ chatId, sender, user2 , text, imageBase64 }) => {
  try {
      // If an image is included, process it

     console.log(imageBase64)

      let imageUrl = null;
      if (imageBase64) {
          const base64Data = imageBase64.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, ''); // Clean the base64 data

          // Generate a unique filename
          const imageName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;

          // Define the path to save the image
          const imagePath = path.join(__dirname, 'public', 'images', imageName);

          // Save the image to the 'public/images' directory using fs.promises
          await fs.promises.writeFile(imagePath, base64Data, 'base64');

          // If the image is saved successfully, set the image URL
          imageUrl = `${imageName}`;
      }

      // Prepare the message object
      const message = {
          chatId : chatId ,
          sender: new ObjectId(sender),
          text,
          image: imageUrl || null,
          timestamp: new Date()
      };

      console.log(message);
 
      console.log(sender.toString())
      // Find the chat and save the message
      const chat = await Chat.findByIdAndUpdate(
          chatId,
          { 
              $push: { messages: message },
              lastMessage: {
                  text: message.text || null,
                  image: message.image || null,
                  timestamp: message.timestamp || new Date(),
                  sender: message.sender || null
              } ,
       
          },
          { 
              new: true,
              upsert: true // If no chat found, create a new one
          }
      );

      if (chat) {
        
        // // Increment the unread count manually after finding the chat
        // if (!chat.unreadCounts) {
        //     chat.unreadCounts = {}; // Initialize unreadCounts if missing
        // }

        // console.log(user2)
    
        // // If the recipient's unread count does not exist, initialize it to 0, then increment by 1
        // chat.unreadCounts[user2] = (chat.unreadCounts[user2] || 0) + 1;

        // Initialize unreadCounts if it's missing
        if (!chat.unreadCounts) {
            chat.unreadCounts = new Map(); // Initialize unreadCounts as Map if missing
         }

        // Use Map's set method to modify the unread count for the recipient
        chat.unreadCounts.set(user2, (chat.unreadCounts.get(user2) || 0) + 1);


        console.log(chat.unreadCounts , user2)
  
        await chat.save()
      
      // Enforce a limit of 20 messages
      if (chat.messages.length > 20) {
          chat.messages = chat.messages.slice(chat.messages.length - 20);
      }

        // Save the updated chat document
        await chat.save();
    
    }

      // Broadcast the message to all users in the room (chatId)
      io.to(chatId).emit('newMessage', message);

  } catch (error) {
      console.error('Error processing message:', error);
  }
});


  //   socket.on('sendMessage',  ({ chatId, sender, text, image }) => {
  //     // If an image is included, process it
  //     let imageUrl = null;
  //     if (image) {
  //         const base64Data = image.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, ''); // Clean the base64 data

  //         // Generate a unique filename
  //         const imageName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;

  //         // Define the path to save the image
  //         const imagePath = path.join(__dirname, 'public', 'images', imageName);

  //         // Save the image to the 'public/images' directory
  //         fs.writeFile(imagePath, base64Data, 'base64', (err:any) => {
  //             if (err) {
  //                 console.error('Error saving image:', err);
  //                 return;
  //             }

  //             // If the image is saved successfully, set the image URL
  //             imageUrl = `${imageName}`;

  //             // Now save the message with image URL to the chat
  //             const message = {
  //                 sender : new ObjectId(sender),
  //                 text,
  //                 image: imageUrl,
  //                 timestamp: new Date()
  //             };

  //             console.log(message)

  //             // Find the chat and save the message
  //             Chat.findByIdAndUpdate(chatId, { 
  //                 $push: { messages: message } ,
  //                 lastMessage: {
  //                   text: message.text || null,
  //                   image: message.image || null,
  //                   timestamp: message.timestamp || new Date(),
  //                   sender: message.sender || null
  //               } // Update the lastMessage field
  //             }, { 
  //                 new: true,
  //                 upsert: true // If no chat found, create a new one
  //             })
  //             .then((chat:any) => {
  //                 // Enforce a limit of 20 messages
  //                 if (chat.messages.length > 20) {
  //                     chat.messages = chat.messages.slice(chat.messages.length - 20);
  //                     chat.save();
  //                 }

  //                 // Broadcast the message to all users in the room (chatId)
  //                 io.to(chatId).emit('newMessage', message);
  //             })
  //             .catch((error:any) => console.error('Error saving message:', error));
  //         });
  //     } else {
  //         // If no image, just send a text message
  //         const message = {
  //           sender : new ObjectId(sender),
  //             text,
  //             timestamp: new Date()
  //         };

  //         // Find the chat and save the message
  //         Chat.findByIdAndUpdate(chatId, { 
  //             $push: { messages: message } 
  //         }, { 
  //             new: true,
  //             upsert: true
  //         })
  //         .then((chat:any) => {
  //             // Enforce a limit of 20 messages
  //             if (chat.messages.length > 20) {
  //                 chat.messages = chat.messages.slice(chat.messages.length - 20);
  //                 chat.save();
  //             }

  //             // Broadcast the message to all users in the room (chatId)
  //             io.to(chatId).emit('newMessage', message);
  //         })
  //         .catch((error:any) => console.error('Error saving message:', error));
  //     }
  // });

    // socket.on('sendMessage', ({ chatId, sender, text }) => {
    //   const message = { sender, text, timestamp: new Date() };
    
    //   // Save the message to the database
    //   Chat.findByIdAndUpdate(chatId, { 
    //     $push: { messages: message } 
    //   }, { 
    //     new: true, 
    //     upsert: true  // If no chat found, create a new one
    //   })
    //   .then((chat:any) => {
    //     // Enforce a limit of 20 messages
    //     if (chat.messages.length > 20) {
    //       chat.messages = chat.messages.slice(chat.messages.length - 20); // Keep only the last 20 messages
    //       chat.save();  // Save the updated chat with 20 messages
    //     }
    
    //     // Broadcast the message to all users in the room (chatId)
    //     io.to(chatId).emit('newMessage', message);
    //   })
    //   .catch((error: any) => console.error('Error saving message:', error));
    // });
    
    // // Handle sending a message
    // socket.on('sendMessage', ({ chatId, sender, text }) => {
    //   const message = { sender, text, timestamp: new Date() };
  
    //   // Broadcast the message to others in the room
    //   io.to(chatId).emit('newMessage', message);
    // });
  

      // socket.on("sendMessage", ({ userId, message }) => {
      //   console.log("Received new message:", message);
      //   // Save the message to the database

      //   // message.timestamp = new Date(Date.now());
      //   console.log(users[userId] , socket.id)
      //   console.log( "Message To"  , userId,  message)

      //   if( users[userId] ){
      //       io.to(users[userId]).emit("message", { userId: userId, message: message });
      //   }
      //   // Emit the new message event to the user room
 
      //   //@ts-ignore
      //    console.log(socket.user.id , socket.id)
      //   //@ts-ignore
      //    io.to(users[socket.user.id]).emit("message", { userId: userId, message: message });

      //   /////// socket.emit("message", {userId: userId, message: message})
      // });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);

       //@ts-ignore
        console.log(socket.user.id)

       //@ts-ignore
        console.log(users[socket.user.id])

        for (let userId in users) {

           //@ts-ignore
          if (users[socket.user.id] == socket.id) {

             console.log("user deleted from sockets")
             //@ts-ignore
              delete users[socket.user.id];
              break;
          }

        }

        console.log(users)
      console.log(`User with socket ${socket.id} disconnected`);

      });

      // Above is chat gpt user to user communication code . ///////////
    });

    io.use(async (socket, next) => {
      // const token = socket.handshake.query.token as string;


      const token = socket.handshake.headers['authorization']?.toString()?.split(' ')[1]; // Extract token from "Bearer <token>"
    
    if (!token) {
        console.log("No token provided");
        return next(new Error('Authentication error'));
    }



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

      // return next();
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
