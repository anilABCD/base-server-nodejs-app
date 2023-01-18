import express from "express";
import catchAsync from "../../../ErrorHandling/catchAsync";

const userRouter = express.Router();
import { Request, Response, NextFunction } from "express";

import { client, db } from "../../../server";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import { packWithObjectID } from "../../../utils/all.util";
import { extractObjectId } from "../../../utils/extractObjectId";
import { ObjectId } from "mongodb";
import AppError from "../../../ErrorHandling/AppError";
import { FromTo } from "./common";

userRouter.route("/").get(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let response = await db
      .collection("user-details")
      .findOne({ userId: req.user?._id });

    res.status(200).json({
      status: "success",
      data: response,
    });
  })
);

userRouter
  .route("/")
  .patch(
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let input = req.body;

      let isError = false;

      let updatingUserObject = {};

      if (input.interests) {
        if (input.interests.length < 3) {
          isError = true;
        } else {
          if (Array.isArray(input.interests)) {
            for (let i = 0; i < input.interests.lenght; i++) {
              if (typeof input.interests[i] !== "string") {
                isError = true;
                break;
              }
            }
          }

          updatingUserObject = {
            interests: input.interests,
          };
        }
      }

      if (input.interests.lenght > 20) {
        isError = true;
      }

      if (isError == true) {
        throw new AppError("Internal Server Error", 500);
      }

      let userDetails = await db.collection("user-details").findOne({
        userId: req.user?._id,
      });

      if (userDetails) {
        let response = await db.collection("user-details").findOneAndUpdate(
          {
            userId: req.user?._id,
          },
          {
            $set: { ...updatingUserObject },
          }
        );

        return res.status(200).json({
          status: "success",
          data: response,
        });
      } else {
        let response = await db.collection("user-details").insertOne({
          userId: req.user?._id,
          ...updatingUserObject,
        });

        return res.status(201).json({
          status: "success",
          data: response,
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
              updatedDate: new Date(Date.now()),
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

export default userRouter;
