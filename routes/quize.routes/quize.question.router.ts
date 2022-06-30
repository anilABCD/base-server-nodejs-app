import express from "express";

import QuizeQuestionController from "../../controllers/quize.controllers/quize.question.controller";
const quizeQuestionController = new QuizeQuestionController();
const quizeQuestionRouter = express.Router();

quizeQuestionRouter
  .route("/")
  .get(quizeQuestionController.get)
  .post(quizeQuestionController.post);

quizeQuestionRouter
  .route("/:id")
  .get(quizeQuestionController.getById)
  .patch(quizeQuestionController.patch)
  .delete(quizeQuestionController.delete);

export default quizeQuestionRouter;
