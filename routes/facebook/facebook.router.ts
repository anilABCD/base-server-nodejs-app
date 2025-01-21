import express from "express";
import GenerateController from "../../controllers/generate.controllers/generate.controller";
import SocialLoginController from "../../controllers/google.controllers/google.controller";
import getCurrentApp from "../../utils/getCurrentApp";

const facebookRouter = express.Router();

const CURRENT_APP = getCurrentApp() || "";

const socialLoginController = new SocialLoginController();

facebookRouter.route("/").post(socialLoginController.signInWithFaceBook);



export default facebookRouter;
