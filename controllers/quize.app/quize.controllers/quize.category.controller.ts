import { autoInjectable } from "tsyringe";
import QuizeCategoryService from "../../../services/quize.app/quize.services/quize.category.service";
import BaseController from "../../base.controller";

@autoInjectable()
export default class QuizeCategoryController extends BaseController {
  constructor(service?: QuizeCategoryService) {
    super(service);
  }
}

//#region  OLD Code :
// import AppError from "../ErrorHandling/AppError";
// import catchAsync from "../ErrorHandling/catchAsync";
// import QuizeCategory from "../Model/quize.category.model";
// import filterObject from "../utils/filterObj.util";

// import { Request, Response, NextFunction } from "express";

// const getAllQuizes = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const quizeCategories = await QuizeCategory.find();
//     res.status(200).json(quizeCategories);
//   }
// );

// const getQuize = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const quizeCategory = await QuizeCategory.findById(req.params.id);

//     if (!quizeCategory) {
//       next(new AppError("Quize not found", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         quizeCategory,
//       },
//     });
//   }
// );

// const createQuize = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const newQuizeCategory = new QuizeCategory();
//     newQuizeCategory.key = req.body.topic; //key
//     await newQuizeCategory.save();

//     // 201 created
//     res.status(201).json({
//       status: "success",
//       data: {
//         quizeCategory: newQuizeCategory,
//       },
//     });
//   }
// );

// const updateQuize = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const filteredBody = filterObject(req.body, ["key"]);

//     const updatedQuizeCateogry = await QuizeCategory.findByIdAndUpdate(
//       req.params.id,
//       filteredBody,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         updatedQuizeCateogry,
//       },
//     });
//   }
// );

// export { getAllQuizes };
// export { getQuize };
// export { createQuize };
// export { updateQuize };
//#endregion
