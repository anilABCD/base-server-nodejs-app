import catchAsync from "../../ErrorHandling/catchAsync";

const express = require("express");
const router = express.Router();
const Interaction = require("../../Model/deverloperDating/interaction"); // Adjust the path as necessary

// Route to get a specific interaction
router.get(
  "/get-likes",
  catchAsync(async (req: any, res: any) => {
    const userId = req.user?._id;

    let skipCount = req.query.skip;

    if (!skipCount) {
      skipCount = 0;
    }

    const limitCount = 10;

    // if (!userId) {
    //   return res
    //     .status(400)
    //     .json({ message: "user1_id and user2_id are required" });
    // }

    console.log(userId);

    try {
      const interaction = await Interaction.find({
        user_to_id: userId,
      })
        .populate("user_from_id", "name technologies photo")
        .sort({ timestamp: -1 }) // Sort by created date in descending order
        .skip(skipCount) // Skip the first `skipCount` results
        .limit(limitCount); // Limit the results to `limitCount` entries

      if (!interaction) {
        return res.status(404).json({ message: "Interaction not found" });
      }

      res.status(200).json(interaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

module.exports = router;
