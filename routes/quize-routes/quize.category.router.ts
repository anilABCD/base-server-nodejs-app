import express from "express";

import QuizeCategoryController from "../../controllers/quize.category.controller";
const quizeCategoryController = new QuizeCategoryController();
const quizeCategoryRouter = express.Router();

quizeCategoryRouter
  .route("/")
  .get(quizeCategoryController.get)
  .post(quizeCategoryController.post);

quizeCategoryRouter.route("/:id").get(quizeCategoryController.getById);
quizeCategoryRouter.route("/:id").patch(quizeCategoryController.patch);

export default quizeCategoryRouter;
