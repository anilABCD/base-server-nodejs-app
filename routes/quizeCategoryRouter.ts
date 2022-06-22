import express from "express";

import * as quizeCategoryController from "../controllers/quizeCategoryController";
const quizeCategoryRouter = express.Router();

quizeCategoryRouter
  .route("/")
  .get(quizeCategoryController.getAllQuizes)
  .post(quizeCategoryController.createQuize);

quizeCategoryRouter.route("/:id").get(quizeCategoryController.getQuize);
quizeCategoryRouter.route("/:id").patch(quizeCategoryController.updateQuize);

export default quizeCategoryRouter;
