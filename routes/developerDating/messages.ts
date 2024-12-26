import catchAsync from "../../ErrorHandling/catchAsync";

const express = require("express");
const Message = require("../../model/deverloperDating/message");
const Chat = require("../../Model/deverloperDating/chat")
const router = express.Router();

// // Send a new message
// router.post(
//   "/",
//   catchAsync(async (req: any, res: any) => {
//     try {
//       const { match_id, sender_id, receiver_id, content } = req.body;

//       const newMessage = new Message({
//         match_id,
//         sender_id,
//         receiver_id,
//         content,
//       });

//       await newMessage.save();
//       res.status(201).send(newMessage);
//     } catch (error: any) {
//       // console.log(error.message);
//       // console.log(error.message);
//       res.status(400).send({ error: error.message });
//     }
//   })
// );

// // Get messages for a match
// router.get(
//   "/:matchId",
//   catchAsync(async (req: any, res: any) => {
//     try {
//       const matchId = req.params.matchId;

//       const messages = await Message.find({ match_id: matchId });

//       res.status(200).send(messages);
//     } catch (error) {
//       res.status(400).send({ error: "Error retrieving messages" });
//     }
//   })
// );

// // Delete a message
// router.delete(
//   "/:messageId",
//   catchAsync(async (req: any, res: any) => {
//     try {
//       const messageId = req.params.messageId;

//       await Message.findByIdAndDelete(messageId);

//       res.status(200).send({ message: "Message deleted successfully" });
//     } catch (error) {
//       res.status(400).send({ error: "Error deleting message" });
//     }
//   })
// );



// router.post('/chats/find-or-create', catchAsync(async (req: any, res: any) => {
//   const { user1, user2 } = req.body; // IDs of the two users

//   try {
//     // Sort participants to ensure uniqueness
//     const participants = [user1, user2].sort();

//     // Check if a chat already exists
//     let chat = await Chat.findOne({ participants });

//     // Create a new chat if none exists
//     if (!chat) {
//       chat = new Chat({ participants, messages: [] });
//       await chat.save();
//     }

//     // Return the chat ID
//     res.status(200).json({ chatId: chat._id });
//   } catch (error: any ) {
//     res.status(500).json({ error: error.message });
//   }
//   })
// );


// Before sending a message, check if a chat between the two users already exists. If not, create one.
router.post('/chats', catchAsync(async (req: any, res: any) => {
  const { user1, user2 } = req.body;

  try {
    // Ensure participants are stored in a consistent order
    const participants = [user1, user2].sort();

    let chat = await Chat.findOne({ participants });
    if (!chat) {
      chat = new Chat({ participants, messages: [] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error:any ) {
    res.status(500).json({ error: error.message });
  }
})
);

// Add a message to an existing one-to-one chat.
router.post('/chats/:chatId/message', catchAsync(async (req: any, res: any) => {
  const { chatId } = req.params;
  const { sender, text } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Push the new message to the messages array
    chat.messages.push({ sender, text });

    // Enforce a limit of 20 messages
    if (chat.messages.length > 20) {
      chat.messages = chat.messages.slice(chat.messages.length - 20); // Keep only the last 20 messages
    }

    // Update the `updatedAt` field
    chat.updatedAt = Date.now();

    await chat.save();  // Save the updated chat

    res.status(201).json({ message: 'Message added', chat });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}));


//Retrieve all messages for a specific chat.
router.get('/chats/:chatId', catchAsync(async (req: any, res: any) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate('participants messages.sender');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    res.json(chat);  // Return the chat with messages
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}));


//Retrieve a chat between two users using their IDs.
router.get('/chats', catchAsync(async (req: any, res: any) => {
  const { user1, user2 } = req.query;

  try {
    const participants = [user1, user2].sort();

    const chat = await Chat.findOne({ participants }).populate('messages.sender');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    res.json(chat);
  } catch (error : any ) {
    res.status(500).json({ error: error.message });
  }
})
);



export default router;
