import { ObjectId } from "mongodb";
import { extractObjectId } from "../../utils/extractObjectId";

const express = require("express");
import AuthService from "../../services/user.services/auth.service";
import User from "../../Model/user.models/user.model";
import catchAsync from "../../ErrorHandling/catchAsync";
import Rejection from "../../Model/deverloperDating/rejection";

const router = express.Router();

let service = new AuthService(User);

// Route to fetch profiles with matching technologies
router.post(
  "/matches",
  catchAsync(async (req: any, res: any) => {
    const requestedTechnologies = req.body.technologies.split(",");
    const minExperience = req.body.minExperience;
    const maxExperience = req.body.maxExperience;

    let rejectedUsers: ObjectId[] = [];

    const userId = new ObjectId(extractObjectId(req.user?._id));

    let rejection = await Rejection.findOne({ userId });

    rejectedUsers.push(userId);

    if (rejection && rejection.rejectedUsers) {
      rejectedUsers.push(...rejection.rejectedUsers);
    }

    console.log("rejected users", rejectedUsers);

    try {
      const profiles = await service.get(
        {
          technologies: { $in: requestedTechnologies, $exists: true },
          experience: {
            $gte: minExperience,
            $lte: maxExperience,
            $exists: true,
          },
          _id: { $nin: [...rejectedUsers] }, // Exclude the specified user ID
        },
        null,
        { experience: -1 }
      );

      console.log(profiles);

      res.json(profiles);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  })
);

// Route to fetch profiles with matching technologies
router.post(
  "/technology",
  catchAsync(async (req: any, res: any) => {
    const userId = req.user._id;
    // Update the user's photo

    console.log(userId);

    console.log(req.body.technologies);

    let user = await User.findByIdAndUpdate(userId, {
      technologies: req.body.technologies,
    });

    res.json({
      status: "success",
    });
  })
);

export default router;
