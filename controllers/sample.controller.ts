import { Request, Response, NextFunction } from "express";

const getSampleData = (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello Sample Controller");
};

exports.getSampleData = getSampleData;
