import express, { NextFunction, Request, Response } from "express";

import AuthController from "../../controllers/user.controllers/auth.controller";

let authController = new AuthController();

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.get(
  "/check-protected",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Is Authenticated User");
  }
);

export default router;
