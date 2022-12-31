import express from "express";
import catchAsync from "../../../ErrorHandling/catchAsync";

const groupsRouter = express.Router();
import { Request, Response, NextFunction } from "express";

import { db } from "../../../server";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import { packWithObjectID } from "../../../utils/all.util";
import { extractObjectId } from "../../../utils/extractObjectId";
import { ObjectId } from "mongodb";

interface FromTo {
  from: number;
  to: number;
}

groupsRouter
  .route("/:groupId?")
  .post(
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let input = req.body as IGroup;
      let group = await db
        .collection("groups")
        .findOne({ userId: req.user?._id, groupName: input.groupName });
      console.log(group);
      if (!group) {
        input.userId = extractObjectId(req.user?._id);
        input = packWithObjectID(input);

        let response = await db.collection("groups").insertOne({
          ...input,
        });
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
      let group = await db.collection("groups").updateOne(
        { _id: new ObjectId(req.params.groupId) },
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
    })
  );

groupsRouter.route("/your-groups/:from/:to?").get(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let fromTo: FromTo = { from: 0, to: 10 };
    let from = req.params.from;
    let to = req.params.to;

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
      .find({})
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
