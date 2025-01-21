import { autoInjectable } from "tsyringe";
import catchAsync from "../../ErrorHandling/catchAsync";
import { Request, Response, NextFunction } from "express";

import { OAuth2Client } from "google-auth-library";
import AppError from "../../ErrorHandling/AppError";
import AuthController from "../user.controllers/auth.controller";
import AuthService from "../../services/user.services/auth.service";
import User from "../../Model/user.models/user.model";
const axios = require('axios');


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

export default class SocialLoginController {



// // Facebook App settings
//    FACEBOOK_APP_ID = 'YOUR_APP_ID'; // Your Facebook App ID
//    FACEBOOK_APP_SECRET = 'YOUR_APP_SECRET'; // Your Facebook App Secret


  constructor() {}

  signInWithGoogle = catchAsync(
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

        return await auth.loginWithSocialLogin(
          response?.email ? response?.email : "",
          response?.name ? response?.name : "",
          "",
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



  signInWithFaceBook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.body.token;
      const extra = req.body.extra;
  
      try {
          // Step 1: Verify the token with Facebook
          const response = await axios.get(`https://graph.facebook.com/me`, {
              params: {
                  access_token: token,
                  fields: 'id,email,name' // Request the email and other user data
              }
          });
  
          
          // // Step 3: Send the user data back to the client
          // res.json({
          //     success: true,
          //     user: {
          //         id: response.id,
          //         email: response.email,
          //         name: response.name
          //     }
          // });

          let service = new AuthService(User);
          let auth = new AuthController(service);
  

        if (!response?.data?.email || response?.data?.email.trim() == "") {

          console.log(response)

          console.log("did not got email form google.");
          throw new AppError("Internal Server Error", 500);
        }

        return await auth.loginWithSocialLogin(
          response?.data?.email ? response?.data?.email : "",
          response?.data?.name ? response?.data?.name : "",
          "",
          req,
          res,
          extra
        );
  
      } catch (error) {
          console.error('Error verifying Facebook token:', error);
          res.status(500).json({
              success: false,
              message: 'Failed to verify Facebook token.'
          });
      }
  });
  
}
