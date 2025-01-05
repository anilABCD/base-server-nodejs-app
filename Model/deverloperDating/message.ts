// // models/message.js
// const mongoose = require("mongoose");
// const Match = require("../../Model/deverloperDating/match");

// const User = require("../../Model/user.models/user.model").default;

// const MessageSchema = new mongoose.Schema(
//   {
//     match_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Match",
//       required: true,
//     },
//     sender_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiver_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
//   },
//   {
//     capped: { size: 15242880, max: 3000, autoIndexId: true },
//   }
// );

// MessageSchema.pre("save", async function (this: any, next: any) {
//   try {
//     const matchExists = await Match.findById(this.match_id);
//     if (!matchExists) {
//       return next(new Error("Invalid match_id"));
//     }

//     const senderExists = await User.findById(this.sender_id);
//     if (!senderExists) {
//       return next(new Error("Invalid sender_id"));
//     }

//     const receiverExists = await User.findById(this.receiver_id);
//     if (!receiverExists) {
//       return next(new Error("Invalid receiver_id"));
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Check if the model already exists to prevent OverwriteModelError
// module.exports =
//   mongoose.models.Message || mongoose.model("Message", MessageSchema);
