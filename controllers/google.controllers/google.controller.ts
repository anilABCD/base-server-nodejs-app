import { autoInjectable } from "tsyringe";
import catchAsync from "../../ErrorHandling/catchAsync";
import { Request, Response, NextFunction } from "express";

export default class GoogleController {
  constructor() {}
  signIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      //   const resource = await this.service?.post(req.body);
      res.status(201).json({
        status: "success",
        data: {
          //   resource,
        },
      });
    }
  );
}
