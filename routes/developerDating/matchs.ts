import catchAsync from "../../ErrorHandling/catchAsync";
import logger from "../../utils/logger";

const mongoose = require("mongoose");

const express = require("express");
const User = require("../../Model/user.models/user.model");
const Match = require("../../Model/deverloperDating/match");

const Interaction = require("../../Model/deverloperDating/interaction");
const Chat = require("../../Model/deverloperDating/chat")
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

      let user2Interaction = await Interaction.findOne({
        user_from_id: user2_id,
        user_to_id: user1_id,
      }).session(session);

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

        console.log(newInteraction);

        await newInteraction.save({ session });
      }

      let existingMatch = await Match.findOne({
        $or: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id },
        ],
      }).session(session); // Include session here

      let doUser2LikeUser1 = false;

      if (user2Interaction) {
        if (user2Interaction.action == "like") {
          doUser2LikeUser1 = true;
        }
      }

      if (existingMatch) {
        if (doUser2LikeUser1) {
          existingMatch.status = "accepted";
        }

        await existingMatch.save({ session });
        await session.commitTransaction();

        console.log(existingMatch);
        console.log(existingInteraction);

        res.status(200).send(existingMatch);
      } else {
        const newMatch = new Match({
          user1_id,
          user2_id,
          status: doUser2LikeUser1 ? "accepted" : "pending",
        });
        await newMatch.save({ session });
        await session.commitTransaction();

        console.log(newMatch);

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
      const isOnline = req.query.isOnline === "true"; // Retrieve isOnline parameter from the query string

      const matchConditions: any = {
        $or: [
          { user1_id: userId },
          { user2_id: userId }
        ],
        status: "accepted",
      };

      const populateOptions = (path: string) => ({
        path,
        select: "_id name photo technologies isOnline",
        ...(req.query.isOnline && { match: { isOnline } }), // Add match condition if isOnline is specified
      });

      const matches = await Match.find(matchConditions)
        .populate(populateOptions("user1_id"))
        .populate(populateOptions("user2_id"))
        .sort({ created_at: -1 }); // Sort by createdAt in descending order

      // Filter out matches where both users failed the isOnline match condition
      const filteredMatches = matches.filter(
        (match:any) => match.user1_id || match.user2_id
      );

      res.status(200).send(filteredMatches);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Error retrieving matches" });
    }
  })
);



// Get matches for a user
router.get(
  "/fromMessages",
  catchAsync(async (req: any, res: any) => {
      const userId = req.user?._id;
      const isOnline = req.query.isOnline === "true"; // Retrieve isOnline parameter from the query string

      try {
        // Find chats where the user is a participant
        const chats = await Chat.find({
          participants: userId, // Ensure the user is in the participants array
        })
          .select('_id participants lastMessage unreadCount') // Fetch only necessary fields
          .populate('participants', "_id name photo technologies isOnline") // Populate specific fields from the User schema
          .lean();
    
        // Format response for the UI
        let responseChats = chats.map( ( chat: any ) => {
{
          console.log( chat.participants.filter( ( p :any ) => p._id.toString() !== userId.toString()))
        return {
              id : chat._id,
              participants: chat.participants.filter( ( p :any ) => p._id.toString() !== userId.toString()),
              messages : [],
              lastMessage: chat.lastMessage,
              unreadCount: chat.unreadCounts?.get(userId.toString()) || 0
        }
      }});

         console.log( responseChats )

        // Format the response to include details of other participants
        return  res.status(200).send(responseChats) ;
      } catch (error) {
        console.error('Error fetching chats for user with participants:', error);
        throw error;
      }
  })
);


router.get('/search-matched-users', catchAsync(async (req: any, res: any) => {
  const { userId, q , isOnlineQuery } = req.query;

  if (!userId || !q) {
    return res.status(400).json({ error: 'User ID and search query are required' });
  }

  
  try {
    const users = await searchMatchedUsers(userId, q , isOnlineQuery);
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: 'An error occurred while searching users' });
  }
}));

const searchMatchedUsers = async (userId : any , searchQuery : String, isOnlineQuery = false) => {
  try {
    const matches = await Match.find({
      $or: [{ user1_id: userId }, { user2_id: userId }],
      status: "accepted",
    })
      .populate({
        path: 'user1_id',
        select: '_id name photo technologies',
        match: {
          name: { $regex: `^${searchQuery}`, $options: 'i' },
          ...(isOnlineQuery && { isOnline: true }),
        }
      })
      .populate({
        path: 'user2_id',
        select: '_id name photo technologies',
        match: {
          match: {
            name: { $regex: `^${searchQuery}`, $options: 'i' },
            ...(isOnlineQuery && { isOnline: true }),
          }
        }
      })
      .sort({ created_at: -1 });

    // Filter out matches where neither user matches the search query
    const filteredMatches = matches.filter( (match : any ) => match.user1_id || match.user2_id);

    // Extract and deduplicate users from matches
    const users = filteredMatches.reduce((acc : any, match: any) => {
      if (match.user1_id && match.user1_id._id.toString() !== userId.toString()) {
        acc.set(match.user1_id, match.user1_id);
      }
      if (match.user2_id && match.user2_id._id.toString() !== userId.toString()) {
        acc.set(match.user2_id, match.user2_id);
      }
      return acc;
    }, new Map());

    return Array.from(users.values());
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

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
