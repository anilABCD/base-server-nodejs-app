import catchAsync from "../../ErrorHandling/catchAsync";

// 1. Define the Rejection Schema
const mongoose = require("mongoose");

const rejectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  rejectedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named 'User'
    },
  ],
});

// 2. Create the Rejection Model
const Rejection = mongoose.model("Rejection", rejectionSchema);

// 3. Implement the Route
const express = require("express");
const router = express.Router();

// Route to add rejected users for a specific user
router.post(
  "/reject/:userId",
  catchAsync(async (req: any, res: any) => {
    const userId = req.user?._id;
    const { rejectedUsers } = req.body;

    try {
      let rejection = await Rejection.findOne({ userId });

      if (!rejection) {
        rejection = new Rejection({
          userId,
          rejectedUsers: [],
        });
      }

      rejection.rejectedUsers.push(...rejectedUsers);
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
