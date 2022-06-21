import express from "express";

const quizeController = require("../controllers/quizController");

const quizRouter = express.Router();

quizRouter
  .route("/")
  .get(quizeController.getAllQuizes)
  .post(quizeController.createQuize);

quizRouter.route("/:id").get(quizeController.getQuize);
quizRouter.route("/:id").patch(quizeController.updateQuize);

module.exports = quizRouter;
