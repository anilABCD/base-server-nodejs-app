import express from "express";
import catchAsync from "../../../ErrorHandling/catchAsync";

const groupsRouter = express.Router();
import { Request, Response, NextFunction } from "express";

import { client, db } from "../../../server";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import { packWithObjectID } from "../../../utils/all.util";
import { extractObjectId } from "../../../utils/extractObjectId";
import { ObjectId } from "mongodb";
import AppError from "../../../ErrorHandling/AppError";

interface FromTo {
  from: number;
  to: number;
}

groupsRouter.route("/:groupId").get(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let response = await db
      .collection("groups")
      .findOne({ _id: new ObjectId(req.params.groupId) });

    res.status(200).json({
      status: "success",
      data: response,
    });
  })
);

groupsRouter
  .route("/:groupId?")
  .post(
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let input: IGroup = req.body;

      let group = await db.collection("user-group-details").findOne({
        userId: req.user?._id,
        groupName: input.groupName,
      });

      // let group = await db
      //   .collection("user-group-details")
      //   .aggregate([
      //     {
      //       $match: {
      //         userId: req.user?._id,
      //       },
      //     },
      //     {
      //       $lookup: {
      //         from: "groups",
      //         localField: "groupId",
      //         foreignField: "_id",

      //         as: "details",
      //       },
      //     },
      //     {
      //       $match: {
      //         "details.groupName": input.groupName,
      //       },
      //     },
      //   ])
      //   .toArray();

      console.log(group);
      if (!group) {
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

              response = await db.collection("groups").insertOne(
                {
                  ...input,
                },
                { session }
              );

              await db.collection("user-group-details").insertOne(
                {
                  userId: new ObjectId(extractObjectId(req.user?._id)),
                  role: "admin",
                  groupId: response.insertedId,
                  groupName: input.groupName,
                  isJoined: false,
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
  )
  .patch(
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let input = req.body as IGroup;

      let paramsGroupId = req.params.groupId;

      let groupDetails = await db.collection("user-group-details").findOne({
        groupId: new ObjectId(paramsGroupId),
        userId: req.user?._id,
        isOwner: true,
      });

      if (groupDetails) {
        let group = await db.collection("groups").updateOne(
          { _id: new ObjectId(paramsGroupId) },
          {
            $set: {
              image: input.image,
            },
          }
        );

        res.status(200).json({
          status: "success",
          data: group,
        });
      } else {
        throw new AppError("Internal Server Error", 500);
      }
    })
  );

groupsRouter.route("/all/:from?/:to?/").post(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let fromTo: FromTo = { from: 0, to: 10 };
    let from = req.params.from;
    let to = req.params.to;

    let isOwner = req.body.isOwner;
    let isJoined = req.body.isJoined;

    let groupName: string = req.body.groupName;

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
      .collection("groups")
      .aggregate([
        groupName
          ? {
              $match: {
                groupName: { $regex: `.*${groupName}.*`, $options: "i" },
              },
            }
          : {
              $project: {
                someFiled: 0,
              },
            },
        {
          $lookup: {
            from: "user-group-details",
            localField: "_id",
            foreignField: "groupId",

            as: "details",
          },
        },
        {
          $project: {
            groupName: 1,
            aboutUs: 1,
            location: 1,
            description: 1,
            image: 1,

            isJoined: {
              $cond: {
                // if fieldB is not present in the document (missing)
                if: {
                  $in: [true, "$details.isJoined"],
                },
                // then set it to some fallback value
                then: true,
                // else return it as is
                else: false,
              },
            },

            isOwner: {
              $cond: {
                // if fieldB is not present in the document (missing)
                if: {
                  $in: [req.user?._id, "$details.userId"],
                },
                // then set it to some fallback value
                then: true,
                // else return it as is
                else: false,
              },
            },
          },
        },
        isOwner
          ? { $match: { isOwner: true } }
          : {
              $project: {
                someFiled: 0,
              },
            },
        isJoined
          ? { $match: { isJoined: true } }
          : {
              $project: {
                someFiled: 0,
              },
            },
      ])
      .skip(Number(fromTo.from))
      .limit(Number(fromTo.to))
      .toArray();

    res.status(200).json({
      status: "success",
      data: response,
    });
  })
);

// quizeNameRouter
//   .route("/:id")
//   .get(quizeNameController.getById)
//   .patch(quizeNameController.patch)
//   .delete(quizeNameController.delete);

export default groupsRouter;
