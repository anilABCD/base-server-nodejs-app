import catchAsync from "../../ErrorHandling/catchAsync";
import logger from "../../utils/logger";

const mongoose = require("mongoose");

const express = require("express");
const User = require("../../Model/user.models/user.model");
const Match = require("../../Model/deverloperDating/match");

const Interaction = require("../../Model/deverloperDating/interaction");

const router = express.Router();

// Create a new match:
router.post(
  "/",
  catchAsync(async (req: any, res: any) => {
    const user1_id = req.user?._id;

    const { user2_id } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let existingInteraction = await Interaction.findOne({
        user_from_id: user1_id,
        user_to_id: user2_id,
      }).session(session); // Include session here

      if (existingInteraction) {
        // If interaction exists, update its action to like
        existingInteraction.action = "like";
        await existingInteraction.save({ session });
      } else {
        // If no interaction exists, create a new interaction with like action
        const newInteraction = new Interaction({
          user_from_id: user1_id,
          user_to_id: user2_id,
          action: "like",
        });
        await newInteraction.save({ session });
      }

      let existingMatch = await Match.findOne({
        $or: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id },
        ],
      }).session(session); // Include session here

      if (existingMatch) {
        await existingMatch.save({ session });
        await session.commitTransaction();
        res.status(200).send(existingMatch);
      } else {
        const newMatch = new Match({
          user1_id,
          user2_id,
          status: "pending",
        });
        await newMatch.save({ session });
        await session.commitTransaction();
        res.status(201).send(newMatch);
      }
    } catch (error) {
      await session.abortTransaction();
      res
        .status(500)
        .send({ error: "An error occurred while processing the request." });
    } finally {
      try {
        session.endSession();
      } catch (endErr) {
        console.error("Error ending session:", endErr);
        logger.exceptionError("Error ending session:" + endErr);
      }
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
