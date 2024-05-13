import express, { NextFunction, Request, Response } from "express";

import AuthController from "../../controllers/user.controllers/auth.controller";
import AuthService from "../../services/user.services/auth.service";
import User from "../../Model/user.models/user.model";

let service = new AuthService(User);

let authController = new AuthController(service);

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/edit", authController.update);

// Protect all routes after this middleware
router.use(authController.protect);

router.get(
  "/check-is-authenticated",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Is Authenticated User");
  }
);

export default router;
