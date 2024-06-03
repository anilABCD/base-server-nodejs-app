import catchAsync from "../../ErrorHandling/catchAsync";
import Rejection from "../../Model/deverloperDating/rejection";
import logger from "../../utils/logger";
const Interaction = require("../../Model/deverloperDating/interaction");

const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

// Route to add rejected users for a specific user
router.post(
  "/reject/:userId",
  catchAsync(async (req: any, res: any) => {
    const userId = req.user?._id;
    const rejectedId = req.params.userId;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let existingInteraction = await Interaction.findOne({
        user_from_id: userId,
        user_to_id: rejectedId,
      }).session(session); // Include session here

      if (existingInteraction) {
        // If interaction exists, update its action to dislike
        existingInteraction.action = "dislike";
        await existingInteraction.save({ session });
      } else {
        // If no interaction exists, create a new interaction with dislike action
        const newInteraction = new Interaction({
          user_from_id: userId,
          user_to_id: rejectedId,
          action: "dislike",
        });
        await newInteraction.save({ session });
      }

      let rejection = await Rejection.findOne({ userId }).session(session); // Include session here

      if (!rejection) {
        rejection = new Rejection({
          userId: userId,
          rejectedUsers: [],
        });
      }

      console.log(rejection);

      rejection.rejectedUsers.push(rejectedId);
      await rejection.save({ session });

      await session.commitTransaction();
      res.status(201).json(rejection);
    } catch (err) {
      await session.abortTransaction();
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
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

// Route to fetch rejected users for a specific user
router.get(
  "/reject/:userId",
  catchAsync(async (req: any, res: any) => {
    const { userId } = req.params;

    try {
      const rejection = await Rejection.findOne({ userId }).populate(
        "rejectedUsers",
        "name"
      ); // Populate rejected user names
      res.json(rejection);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  })
);

export default router;
