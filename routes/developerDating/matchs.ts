import catchAsync from "../../ErrorHandling/catchAsync";

const express = require("express");
const Match = require("../../Model/deverloperDating/match");

const router = express.Router();

// Create a new match:
router.post(
  "/",
  catchAsync(async (req: any, res: any) => {
    try {
      const { user1_id, user2_id } = req.body;

      const newMatch = new Match({
        user1_id,
        user2_id,
        status: "pending",
      });

      await newMatch.save();
      res.status(201).send(newMatch);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Error creating match" });
    }
  })
);

// Get matches for a user
router.get(
  "/:userId",
  catchAsync(async (req: any, res: any) => {
    try {
      const userId = req.params.userId;

      const matches = await Match.find({
        $or: [{ user1_id: userId }, { user2_id: userId }],
      });

      res.status(200).send(matches);
    } catch (error) {
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
