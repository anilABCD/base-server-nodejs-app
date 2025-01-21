import express from "express";
import GenerateController from "../../controllers/generate.controllers/generate.controller";
import SocialLoginController from "../../controllers/google.controllers/google.controller";
import getCurrentApp from "../../utils/getCurrentApp";

const googleRouter = express.Router();

const CURRENT_APP = getCurrentApp() || "";

const googleController = new SocialLoginController();

googleRouter.route("/").post(googleController.signInWithGoogle);



export default googleRouter;
