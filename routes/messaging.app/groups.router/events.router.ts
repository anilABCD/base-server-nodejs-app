import express from "express";

import catchAsync from "../../../ErrorHandling/catchAsync";

import { Request, Response, NextFunction } from "express";
import { client, db } from "../../../server";

import { packWithObjectID } from "../../../utils/all.util";
import { extractObjectId } from "../../../utils/extractObjectId";
import { ObjectId } from "mongodb";

import IEvent from "../../../interfaces/messaging.app/event.interfaces/event.interfaces";

const eventRouter = express.Router();

eventRouter.route("/:eventId?").post(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let input = req.body as IEvent;

    let event = await db
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

    console.log(event);
    if (event.length == 0) {
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

            await db.collection("user-event-details").insertOne(
              {
                userId: new ObjectId(extractObjectId(req.user?._id)),
                eventId: response.insertedId,
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
          console.log("The group was successfully created.");
        } else {
          console.log("The group was intentionally aborted.");
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
);

export { eventRouter };
