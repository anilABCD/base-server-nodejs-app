import { Request, Response, NextFunction } from "express";

const errorController = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("**********From Error Controller ********");
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;

  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorController;
