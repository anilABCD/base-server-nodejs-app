import express, { NextFunction, Request, Response } from "express";

import AuthController from "../../controllers/user.controllers/auth.controller";
import AuthService from "../../services/user.services/auth.service";
import User from "../../Model/user.models/user.model";
import catchAsync from "../../ErrorHandling/catchAsync";
const axios = require('axios');

let service = new AuthService(User);

let authController = new AuthController(service);

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.post("/uploadImage", authController.uploadImage);

// Set user online
router.post('/:userId/online', catchAsync(async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(userId, { isOnline: true }, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    console.log(user)

    res.status(200).json({ message: 'User set to online',  ...{
    
        _id: user._id, isOnline: user.isOnline 
  }
});
  } catch (error:any) {
    res.status(500).send(error.message);
  }
}));


// Set user offline
router.post('/:userId/offline',  catchAsync(async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndUpdate(userId, { isOnline: false }, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    console.log("is Online" , user.isOnline)

    res.status(200).json({ message: 'User set to offline',  ...{
    
      _id: user._id, isOnline: user.isOnline 
}
});
  } catch (error : any) {
    res.status(500).send(error.message);
  }
}));


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
