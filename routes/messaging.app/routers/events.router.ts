import express from "express";

import catchAsync from "../../../ErrorHandling/catchAsync";

import { Request, Response, NextFunction } from "express";
import { client, db } from "../../../server";

import { packWithObjectID } from "../../../utils/all.util";
import { extractObjectId } from "../../../utils/extractObjectId";
import { ObjectId } from "mongodb";

import IEvent from "../../../interfaces/messaging.app/event.interfaces/event.interfaces";
import AppError from "../../../ErrorHandling/AppError";
import { FromTo } from "./common";

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
      let eventInput: IEvent = req.body;

      let error = false;
      if (!eventInput.eventName) {
        error = true;
      }

      if (!eventInput.startDate) {
        error = true;
      }

      if (!eventInput.startTime) {
        error = true;
      }

      if (!eventInput.aboutUs) {
        error = true;
      }

      if (!eventInput.description) {
        error = true;
      }

      if (!eventInput.location) {
        error = true;
      }

      if (error == true) {
        throw new AppError("Internal Server Error", 500);
      }

      let input = eventInput as IEvent;

      let event = await db.collection("user-event-details").findOne({
        userId: req.user?._id,
        eventName: input.eventName,
      });

      // sample :
      // let group = await db
      // .collection("user-event-details")
      // .aggregate([
      //   {
      //     $match: {
      //       userId: req.user?._id,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "events",
      //       localField: "eventId",
      //       foreignField: "_id",

      //       as: "details",
      //     },
      //   },
      //   {
      //     $match: {
      //       "details.eventName": input.eventName,
      //     },
      //   },
      // ])
      // .toArray();

      console.log(event);
      if (!event) {
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
                  createdDate: new Date(Date.now()),
                },
                { session }
              );

              await db.collection("user-event-details").insertOne(
                {
                  userId: new ObjectId(extractObjectId(req.user?._id)),
                  role: "admin",
                  eventId: response.insertedId,
                  eventName: input.eventName,
                  isOwner: true,
                  isFavorite: false,
                  createdDate: new Date(Date.now()),
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

      let eventDetails = await db.collection("user-event-details").findOne({
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
              updatedDate: new Date(Date.now()),
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

eventRouter.route("/all/:from?/:to?/").post(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let fromTo: FromTo = { from: 0, to: 10 };
    let from = req.params.from;
    let to = req.params.to;

    let isOwner = req.body.isOwner;
    let isJoined = req.body.isJoined;

    let eventName: string = req.body.eventName;

    if (from) {
      fromTo.from = Number(req.params.from);
    }

    if (to) {
      fromTo.to = Number(req.params.to);

      if (fromTo.to > 20) {
        fromTo.to = 20;
      }
    }

    let response = await db
      .collection("events")
      .aggregate([
        eventName
          ? {
              $match: {
                eventName: { $regex: `.*${eventName}.*`, $options: "i" },
              },
            }
          : {
              $project: {
                someFiled: 0,
              },
            },
        {
          $lookup: {
            from: "groups",
            localField: "groupId",
            foreignField: "_id",

            as: "group",
          },
        },
        {
          $unwind: {
            path: "$group",
            preserveNullAndEmptyArrays: true,
          },
        },
        isOwner
          ? {
              $lookup: {
                from: "user-event-details",
                localField: "_id",
                foreignField: "eventId",
                pipeline: [
                  {
                    $match: {
                      userId: req.user?._id,
                    },
                  },
                ],
                as: "details",
              },
            }
          : {
              $project: {
                someField: 0,
              },
            },
        {
          $unwind: {
            path: "$details",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .sort({ createdDate: -1 })
      .skip(Number(fromTo.from))
      .limit(Number(fromTo.to))
      .toArray();

    res.status(200).json({
      status: "success",
      data: response,
    });
  })
);

// // quizeNameRouter
// //   .route("/:id")
// //   .get(quizeNameController.getById)
// //   .patch(quizeNameController.patch)
// //   .delete(quizeNameController.delete);

export default eventRouter;
