const express = require("express");
const Message = require("../../model/deverloperDating/message");

const router = express.Router();

// Send a new message
router.post("/", async (req: any, res: any) => {
  try {
    const { match_id, sender_id, receiver_id, content } = req.body;

    const newMessage = new Message({
      match_id,
      sender_id,
      receiver_id,
      content,
    });

    await newMessage.save();
    res.status(201).send(newMessage);
  } catch (error) {
    res.status(400).send({ error: "Error sending message" });
  }
});

// Get messages for a match
router.get("/:matchId", async (req: any, res: any) => {
  try {
    const matchId = req.params.matchId;

    const messages = await Message.find({ match_id: matchId });

    res.status(200).send(messages);
  } catch (error) {
    res.status(400).send({ error: "Error retrieving messages" });
  }
});

// Delete a message
router.delete("/:messageId", async (req: any, res: any) => {
  try {
    const messageId = req.params.messageId;

    await Message.findByIdAndDelete(messageId);

    res.status(200).send({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: "Error deleting message" });
  }
});

export default router;
