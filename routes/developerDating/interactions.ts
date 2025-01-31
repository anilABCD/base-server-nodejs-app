import catchAsync from "../../ErrorHandling/catchAsync";

const express = require("express");
const Interaction = require("../../Model/deverloperDating/interaction");

const router = express.Router();

// Create a new interaction (like or dislike)
router.post(
  "/",
  catchAsync(async (req: any, res: any) => {
    try {
      const { user_from_id, user_to_id, action } = req.body;

      const newInteraction = new Interaction({
        user_from_id,
        user_to_id,
        action,
      });

      await newInteraction.save();
      res.status(201).send(newInteraction);
    } catch (error) {
      res.status(400).send({ error: "Error creating interaction" });
    }
  })
);

// Get who liked a user
router.get(
  "/liked/:userId",
  catchAsync(async (req: any, res: any) => {
    try {
      const userId = req.params.userId;

      const likes = await Interaction.find({
        user_to_id: userId,
        action: "like",
      }).populate("user_from_id", "username");

      res.status(200).send(likes);
    } catch (error) {
      res.status(400).send({ error: "Error retrieving likes" });
    }
  })
);

// Delete an interaction
router.delete(
  "/:interactionId",
  catchAsync(async (req: any, res: any) => {
    try {
      const interactionId = req.params.interactionId;

      await Interaction.findByIdAndDelete(interactionId);

      res.status(200).send({ message: "Interaction deleted successfully" });
    } catch (error) {
      res.status(400).send({ error: "Error deleting interaction" });
    }
  })
);

export default router;
