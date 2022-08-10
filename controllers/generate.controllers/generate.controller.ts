import catchAsync from "../../ErrorHandling/catchAsync";

import { Request, Response, NextFunction } from "express";

export default class GenerateController {
  constructor() {}

  generate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let result = true;

      res.status(200).json({
        status: "success",
        data: {
          generated: result,
        },
      });
    }
  );
}
