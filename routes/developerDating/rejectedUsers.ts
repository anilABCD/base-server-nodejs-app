import catchAsync from "../../ErrorHandling/catchAsync";
import Rejection from "../../Model/deverloperDating/rejection";

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
      res.status(500).json({ message: err.message });
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
