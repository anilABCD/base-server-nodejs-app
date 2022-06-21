import AppError from "../ErrorHandling/AppError";
import catchAsync from "../ErrorHandling/catchAsync";
import Quize from "../Model/Quize";
const filterObj = require("../utils/filterObj");

import { Request, Response, NextFunction } from "express";

const getAllQuizes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const quizes = await Quize.find();
    res.status(200).json(quizes);
  }
);

const getQuize = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const quize = await Quize.findById(req.params.id);

    if (!quize) {
      next(new AppError("Quize not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        quize,
      },
    });
  }
);

const createQuize = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newQuize = new Quize();
    newQuize.key = req.body.topic; //key
    await newQuize.save();

    // 201 created
    res.status(201).json({
      status: "success",
      data: {
        quize: newQuize,
      },
    });
  }
);

const updateQuize = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const quize = Quize.findById(req.params.id);

    if (!quize) {
      next(new AppError("Quize not found", 404));
    }

    filterObj(quize, req.body, ["key"]);

    await quize.save();

    res.status(200).json({
      status: "success",
      data: {
        updatedQuize: quize,
      },
    });
  }
);

export { getAllQuizes };
export { getQuize };
export { createQuize };
export { updateQuize };
