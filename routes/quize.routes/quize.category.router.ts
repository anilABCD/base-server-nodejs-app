import express from "express";

import QuizeCategoryController from "../../controllers/quize.controllers/quize.category.controller";
const quizeCategoryController = new QuizeCategoryController();
const quizeCategoryRouter = express.Router();

quizeCategoryRouter
  .route("/")
  .get(quizeCategoryController.get)
  .post(quizeCategoryController.post);

quizeCategoryRouter
  .route("/:id")
  .get(quizeCategoryController.getById)
  .patch(quizeCategoryController.patch)
  .delete(quizeCategoryController.delete);

export default quizeCategoryRouter;
