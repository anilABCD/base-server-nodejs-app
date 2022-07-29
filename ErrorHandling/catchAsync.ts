import { Request, Response, NextFunction } from "express";

function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): any {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
}

export default catchAsync;
