import catchAsync from "../../ErrorHandling/catchAsync";
import Rejection from "../../Model/deverloperDating/rejection";
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

    try {
      let existingInteraction = await Interaction.findOne({
        user_from_id: userId,
        user_to_id: rejectedId,
      });

      if (existingInteraction) {
        // If interaction exists, update its action to dislike
        existingInteraction.action = "dislike";

        await existingInteraction.save();
      } else {
        // If no interaction exists, create a new interaction with dislike action
        const newInteraction = new Interaction({
          user_from_id: userId,
          user_to_id: rejectedId,
          action: "dislike",
        });

        await newInteraction.save();
      }

      let rejection = await Rejection.findOne({ userId });

      if (!rejection) {
        rejection = new Rejection({
          userId: userId,
          rejectedUsers: [],
        });
      }

      console.log(rejection);

      rejection.rejectedUsers.push(rejectedId);
      await rejection.save();

      res.status(201).json(rejection);
    } catch (err: any) {
      console.log(err);

      res.status(500).json({ message: "Internal Server Error" });
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
