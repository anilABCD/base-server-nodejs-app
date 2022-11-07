import express from "express";
import GenerateController from "../../controllers/generate.controllers/generate.controller";
import GoogleController from "../../controllers/google.controllers/google.controller";
import getCurrentApp from "../../utils/getCurrentApp";

const googleRouter = express.Router();

const CURRENT_APP = getCurrentApp() || "";

const googleController = new GoogleController();

googleRouter.route("/").post(googleController.signIn);

export default googleRouter;
