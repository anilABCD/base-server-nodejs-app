import express from "express";

import catchAsync from "../../../ErrorHandling/catchAsync";

import { Request, Response, NextFunction } from "express";
import { client, db } from "../../../server";

import { packWithObjectID } from "../../../utils/all.util";
import { extractObjectId } from "../../../utils/extractObjectId";
import { ObjectId } from "mongodb";

import IEvent from "../../../interfaces/messaging.app/event.interfaces/event.interfaces";
import AppError from "../../../ErrorHandling/AppError";

const eventRouter = express.Router();

eventRouter.route("/:eventId").get(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let response = await db
      .collection("events")
      .findOne({ _id: new ObjectId(req.params.eventId) });

    res.status(200).json({
      status: "success",
      data: response,
    });
  })
);

eventRouter
  .route("/:eventId?")
  .post(
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let input: IEvent = req.body;

      let group = await db
        .collection("user-event-details")
        .aggregate([
          {
            $match: {
              userId: req.user?._id,
            },
          },
          {
            $lookup: {
              from: "events",
              localField: "eventId",
              foreignField: "_id",

              as: "details",
            },
          },
          {
            $match: {
              "details.eventName": input.eventName,
            },
          },
        ])
        .toArray();

      console.log(group);
      if (group.length == 0) {
        const transactionOptions = {
          readPreference: "primary",
          readConcern: { level: "local" },
          writeConcern: { w: "majority" },
        };
        let response;
        const session = client.startSession();
        try {
          const transactionOutput = await session.withTransaction(
            async () => {
              input = packWithObjectID(input);

              response = await db.collection("events").insertOne(
                {
                  ...input,
                },
                { session }
              );

              await db.collection("user-events-details").insertOne(
                {
                  userId: new ObjectId(extractObjectId(req.user?._id)),
                  role: "admin",
                  eventId: response.insertedId,
                  isOwner: true,
                  isFavorite: false,
                },
                { session }
              );
            },
            {
              readPreference: "primary",
              readConcern: { level: "local" },
              writeConcern: { w: "majority" },
            }
          );

          if (transactionOutput) {
            console.log("The event was successfully created.");
          } else {
            console.log("The event was intentionally aborted.");
          }
        } catch (e) {
          console.log(
            "The transaction was aborted due to an unexpected error: " + e
          );
        } finally {
          await session.endSession();
        }

        res.status(201).json({
          status: "success",
          data: response,
        });
      } else {
        return res.status(200).json({
          status: "failed",
          message: "duplicate",
        });
      }
    })
  )
  .patch(
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let input = req.body as IEvent;

      let paramsEventId = req.params.eventId;

      console.log(paramsEventId);

      let eventDetails = await db.collection("user-events-details").findOne({
        eventId: new ObjectId(paramsEventId),
        userId: req.user?._id,
        isOwner: true,
      });

      if (eventDetails) {
        let event = await db.collection("events").updateOne(
          { _id: new ObjectId(paramsEventId) },
          {
            $set: {
              image: input.image,
            },
          }
        );

        res.status(200).json({
          status: "success",
          data: event,
        });
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    })
  );

// groupsRouter.route("/all/:from?/:to?/").post(
//   catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     let fromTo: FromTo = { from: 0, to: 10 };
//     let from = req.params.from;
//     let to = req.params.to;

//     let isOwner = req.body.isOwner;
//     let isJoined = req.body.isJoined;

//     let groupName: string = req.body.groupName;

//     if (from) {
//       fromTo.from = Number(req.params.from);
//     }

//     if (to) {
//       fromTo.to = Number(req.params.to);

//       if (fromTo.to > 20) {
//         fromTo.to = 20;
//       }
//     }

//     let response = await db
//       .collection("groups")
//       .aggregate([
//         groupName
//           ? {
//               $match: {
//                 groupName: { $regex: `.*${groupName}.*`, $options: "i" },
//               },
//             }
//           : {
//               $project: {
//                 someFiled: 0,
//               },
//             },
//         {
//           $lookup: {
//             from: "user-group-details",
//             localField: "_id",
//             foreignField: "groupId",

//             as: "details",
//           },
//         },
//         {
//           $project: {
//             groupName: 1,
//             aboutUs: 1,
//             location: 1,
//             description: 1,
//             image: 1,

//             isJoined: {
//               $cond: {
//                 // if fieldB is not present in the document (missing)
//                 if: {
//                   $in: [true, "$details.isJoined"],
//                 },
//                 // then set it to some fallback value
//                 then: true,
//                 // else return it as is
//                 else: false,
//               },
//             },

//             isOwner: {
//               $cond: {
//                 // if fieldB is not present in the document (missing)
//                 if: {
//                   $in: [req.user?._id, "$details.userId"],
//                 },
//                 // then set it to some fallback value
//                 then: true,
//                 // else return it as is
//                 else: false,
//               },
//             },
//           },
//         },
//         isOwner
//           ? { $match: { isOwner: true } }
//           : {
//               $project: {
//                 someFiled: 0,
//               },
//             },
//         isJoined
//           ? { $match: { isJoined: true } }
//           : {
//               $project: {
//                 someFiled: 0,
//               },
//             },
//       ])
//       .skip(Number(fromTo.from))
//       .limit(Number(fromTo.to))
//       .toArray();

//     res.status(200).json({
//       status: "success",
//       data: response,
//     });
//   })
// );

// // quizeNameRouter
// //   .route("/:id")
// //   .get(quizeNameController.getById)
// //   .patch(quizeNameController.patch)
// //   .delete(quizeNameController.delete);

export default eventRouter;
