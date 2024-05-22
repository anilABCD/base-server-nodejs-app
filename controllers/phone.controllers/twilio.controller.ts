const twilio = require("twilio");
import { autoInjectable } from "tsyringe";
import catchAsync from "../../ErrorHandling/catchAsync";
import { Request, Response, NextFunction } from "express";

import { OAuth2Client } from "google-auth-library";
import AppError from "../../ErrorHandling/AppError";
import AuthController from "../user.controllers/auth.controller";
import AuthService from "../../services/user.services/auth.service";
import User from "../../Model/user.models/user.model";

const accountSid = "ACd860e4eb9c5280b60bc5f98487038c68"; // Replace with your Account SID from www.twilio.com/console
const authToken = "9a9594397580e51b1520e7e96ff29d77"; // Replace with your Auth Token from www.twilio.com/console
const verifyServiceSid = "VA51c58d2fa188a91e7b8af1fc9ea3baa1"; // Replace with your Verify Service SID
const client = twilio(accountSid, authToken);

export default class TwilioController {
  constructor() {}

  sendOtp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { phoneNumber } = req.body;

      console.log("step 1");
      try {
        client.verify
          .services(verifyServiceSid)
          .verifications.create({ to: phoneNumber, channel: "sms" })
          .then((verification: any) => res.send(verification))
          .catch((error: any) => res.status(500).send(error));
      } catch (error) {
        console.log(error);

        throw new AppError("Internal Server Error", 500);
      }
    }
  );

  verifyOTP = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { phoneNumber, code } = req.body;

      client.verify
        .services(verifyServiceSid)
        .verificationChecks.create({ to: phoneNumber, code: code })
        .then((verification_check: any) => {
          if (verification_check.status === "approved") {
          } else {
            res.status(400).send("Invalid OTP");
          }
        })
        .catch((error: any) => res.status(500).send(error));
    }
  );
}
