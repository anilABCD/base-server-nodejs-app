import express from "express";
import GenerateController from "../../controllers/generate.controllers/generate.controller";
import getCurrentApp from "../../utils/getCurrentApp";

const generateRouter = express.Router();

const CURRENT_APP = getCurrentApp() || "";

const generateController = new GenerateController(CURRENT_APP);

generateRouter.route("/").post(generateController.generate);

export default generateRouter;
