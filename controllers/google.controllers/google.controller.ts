import { autoInjectable } from "tsyringe";
import catchAsync from "../../ErrorHandling/catchAsync";
import { Request, Response, NextFunction } from "express";

import { OAuth2Client } from "google-auth-library";
import AppError from "../../ErrorHandling/AppError";
import AuthController from "../user.controllers/auth.controller";
import AuthService from "../../services/user.services/auth.service";
import User from "../../Model/user.models/user.model";

const CLIENT_ID =
  "346488674498-473kab7r2k8e5j5fcqmh7js4dfvgr6j6.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

async function verify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload?.sub;
  console.log(payload);
  return payload;
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

export default class GoogleController {
  constructor() {}

  signIn = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.body.token;
      const extra = req.body.extra;

      console.log("step 1");
      try {
        let response = await verify(token);

        let service = new AuthService(User);
        let auth = new AuthController(service);

        if (!response?.email || response.email.trim() == "") {
          console.log("did not got email form google.");
          throw new AppError("Internal Server Error", 500);
        }

        return auth.loginWithGoogle(
          response?.email ? response?.email : "",
          response?.name ? response?.name : "",
          response?.picture ? response?.picture : "",
          req,
          res,
          extra
        );
      } catch (error) {
        console.log(error);

        throw new AppError("Internal Server Error", 500);
      }
    }
  );
}
