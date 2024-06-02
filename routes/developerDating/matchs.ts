import catchAsync from "../../ErrorHandling/catchAsync";

const express = require("express");
const User = require("../../Model/user.models/user.model");
const Match = require("../../Model/deverloperDating/match");

const Interaction = require("../../Model/deverloperDating/interaction");

const router = express.Router();

// Create a new match:
router.post(
  "/",
  catchAsync(async (req: any, res: any) => {
    try {
      const user1_id = req.user?._id;

      const { user2_id } = req.body;

      let existingInteraction = await Interaction.findOne({
        user_from_id: user1_id,
        user_to_id: user2_id,
      });

      if (existingInteraction) {
        // If interaction exists, update its action to dislike
        existingInteraction.action = "like";

        await existingInteraction.save();
      } else {
        // If no interaction exists, create a new interaction with dislike action
        const newInteraction = new Interaction({
          user_from_id: user1_id,
          user_to_id: user2_id,
          action: "like",
        });

        await newInteraction.save();
      }

      let existingMatch = await Match.findOne({
        $or: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id },
        ],
      });

      if (existingMatch) {
        // If match exists, update its status or any other field as required
        existingMatch.status = "accepted"; // Update the status to pending or any other logic as needed
        await existingMatch.save();
        res.status(200).send(existingMatch);
      } else {
        const newMatch = new Match({
          user1_id,
          user2_id,
          status: "pending",
        });

        await newMatch.save();

        res.status(201).send(newMatch);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Error creating match" });
    }
  })
);

// Get matches for a user
router.get(
  "/",
  catchAsync(async (req: any, res: any) => {
    try {
      const userId = req.user?._id;

      const matches = await Match.find({
        $or: [{ user1_id: userId }, { user2_id: userId }],
        status: "accepted",
      })
        .populate("user1_id")
        .populate("user2_id");

      res.status(200).send(matches);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Error retrieving matches" });
    }
  })
);

// Update match status
router.put(
  "/:matchId",
  catchAsync(async (req: any, res: any) => {
    try {
      const matchId = req.params.matchId;
      const { status } = req.body;

      const updatedMatch = await Match.findByIdAndUpdate(
        matchId,
        { $set: { status } },
        { new: true }
      );

      res.status(200).send(updatedMatch);
    } catch (error) {
      res.status(400).send({ error: "Error updating match" });
    }
  })
);

// Delete a match
router.delete(
  "/:matchId",
  catchAsync(async (req: any, res: any) => {
    try {
      const matchId = req.params.matchId;

      await Match.findByIdAndDelete(matchId);

      res.status(200).send({ message: "Match deleted successfully" });
    } catch (error) {
      res.status(400).send({ error: "Error deleting match" });
    }
  })
);

export default router;
