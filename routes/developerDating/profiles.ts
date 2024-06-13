import { ObjectId } from "mongodb";
import { extractObjectId } from "../../utils/extractObjectId";

const express = require("express");
import AuthService from "../../services/user.services/auth.service";
import User from "../../Model/user.models/user.model";
import catchAsync from "../../ErrorHandling/catchAsync";
import Rejection from "../../Model/deverloperDating/rejection";
import console from "../../utils/console";

const router = express.Router();

let service = new AuthService(User);

// Route to fetch profiles with matching technologies
router.get(
  "/",
  catchAsync(async (req: any, res: any) => {
    let requestedTechnologies = req.user?.technologies;

    let minExperience = req.user?.experience;
    let maxExperience = minExperience + 5;

    if (req.query.technologies) {
      requestedTechnologies = req.query.technologies
        .split(",")
        .map((technology: any) => technology.trim());
    }

    if (req.query.minExperience) {
      minExperience = parseInt(req.query.minExperience);
    }

    if (req.query.maxExperience) {
      maxExperience = parseInt(req.query.maxExperience);
    }

    console.log(
      "Parameters Got",
      minExperience,
      maxExperience,
      requestedTechnologies
    );

    let skip = req.query.skip;

    if (!skip) {
      skip = 0;
    }

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
        { experience: -1 },
        skip
      );

      console.log(profiles);
      // console.log(profiles);

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

// Route to fetch profiles with matching technologies
router.post(
  "/hobbies",
  catchAsync(async (req: any, res: any) => {
    const userId = req.user._id;
    // Update the user's photo

    console.log(userId);

    console.log(req.body.hobbies);

    let user = await User.findByIdAndUpdate(userId, {
      hobbies: req.body.hobbies,
    });

    res.json({
      status: "success",
    });
  })
);

export default router;
