import express from "express";
import GenerateController from "../../controllers/generate.controllers/generate.controller";

const generateRouter = express.Router();

const generateController = new GenerateController();

generateRouter.route("/").post(generateController.generate);

export default generateRouter;
