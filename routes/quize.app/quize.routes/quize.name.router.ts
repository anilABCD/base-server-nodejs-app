import express from "express";

import QuizeNameController from "../../../controllers/quize.app/quize.controllers/quize.name.controller";
const quizeNameController = new QuizeNameController();
const quizeNameRouter = express.Router();

quizeNameRouter
  .route("/")
  .get(quizeNameController.get)
  .post(quizeNameController.post);

quizeNameRouter
  .route("/:id")
  .get(quizeNameController.getById)
  .patch(quizeNameController.patch)
  .delete(quizeNameController.delete);

export default quizeNameRouter;
