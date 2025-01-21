import { RolesEnum } from "./../../model.types/user.types/user.model.types";
import { autoInjectable } from "tsyringe";

const fs = require("fs");

import BaseController from "../base.controller";
import getEnv, { EnvEnumType } from "../../env/getEnv";
import { Request, Response, NextFunction } from "express";
const allValidator = require("validator");
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const path = require("path");
const sharp = require('sharp');

const multer = require("multer");

import validator from "email-validator";

import AppError from "../../ErrorHandling/AppError";
import Email from "../../utils/email";
import IUser, {
  IUserMethods,
  IUserModel,
} from "../../interfaces/user.interfaces/user.interface";
import { Gender, Roles } from "../../model.types/user.types/user.model.types";
import AuthService from "../../services/user.services/auth.service";
import console from "../../utils/console";
import catchAsync from "../../ErrorHandling/catchAsync";
import User from "../../Model/user.models/user.model";
import logger from "../../utils/logger";

// Multer config
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/images/"),
  filename: function (req: any, file: any, cb: any) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000000 },
  fileFilter: function (req: any, file: any, cb: any) {
    checkFileType(file, cb);
  },
}).single("myImage");

const checkFileType = (file: any, cb: any) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

export default class AuthController extends BaseController {
  service: AuthService;
  constructor(service: AuthService) {
    super(service);
    this.service = service;
  }

  signToken = (id: String) => {
    return jwt.sign({ id }, getEnv(EnvEnumType.JWT_SECRET)?.toString(), {
      //IMPORTANT: in days ...
      // WARN : JWT_EXPIRES_IN has d literal : 90d , with d letter in that.
      // WARN : JWT_COOKIE_EXPIRES_IN is with out d literal (d letter in that)
      expiresIn: getEnv(EnvEnumType.JWT_EXPIRES_IN)?.toString(),
    });
  };

  createSendToken = (
    user: any,
    statusCode: number,
    req: Request,
    res: Response,
    extra: string
  ) => {
    console.log("step 4 creating token");
    const token = this.signToken(user._id);

    user = user as IUser;
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() +
          parseInt(
            getEnv(EnvEnumType.JWT_COOKIE_EXPIRES_IN)?.toString() || "1"
          ) *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: true, // Set secure to true for HTTPS
      domain: ".developerext.com",
      sameSite: "none", // Required for cross-origin cookies
      path: "/", // Set the appropriate path
      // @Production : add below line in production if commented
      // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    // Remove password from output
    user.password = "";

    console.log(user.technologies);

    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          technologies: user.technologies ? user.technologies.join(",") : "",
          hobbies: user.hobbies ? user.hobbies.join(",") : "",
          dob: user.dob,
          drinking: user.drinking,
          smoking: user.smoking,
          bio: user.bio ,
          jobRole : user.jobRole
        },
      },
    });
  };

  signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const newUser = await this.service?.post({
          id: "",
          photo: "",
          createdDate: new Date(),
          updatedDate: new Date(),
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
          active: true,
          experience: req.body.experience,
          technology: req.body.technology,
          
        });

        const extra = req.body.extra;

        console.log("new user created");

        if (
          req.body.phone &&
          req.body.phone.trim() != "" &&
          allValidator.isMobilePhone(req.body.phone, "en-IN", {
            strictMode: false,
          })
        ) {
        }

        if (
          req.body.email &&
          req.body.email.trim() != "" &&
          allValidator.isEmail(req.body.email)
        ) {
          const url = `${req.protocol}://${req.get("host")}/me`;
          // console.log(url);
          //@Production : Email

          await new Email(newUser, url).sendWelcome();
        }

        this.createSendToken(newUser, 201, req, res, extra);
      } catch (error: any) {
        if (error.code === 11000) {
          // Duplicate key error
          res.status(400).send({
            error: "DUPLICATE_USER",
            details: error.keyValue,
          });
        } else {
          console.log(error);

          res.status(500).send({ error: "Internal server error" });
        }
      }
    }
  );

  update = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const id = req.body.id;

      const gender = req.body.gender;
      const name = req.body.name;

      let updateObject = {};
      if (gender) {
        updateObject = {
          ...updateObject,
          gender: gender,
        };
      }

      if (name) {
        updateObject = {
          ...updateObject,
          name: name,
        };
      }

      const newUser = await this.service?.update(id, {
        ...updateObject,
        updatedDate: new Date(),
      });

      console.log(newUser);

      return res.status(200).json({
        status: "success",
        body: {
          user: newUser,
        },
      });
    }
  );

  login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password, extra } = req.body;

      // 1) Check if email and password exist
      if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
      }
      // 2) Check if user exists && password is correct
      const user = await this.service?.findOneDocument({ email }, "+password");
      // CHECK :

      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
      }

      // 3) If everything ok, send token to client
      this.createSendToken(user, 200, req, res, extra);
    }
  );

  signUpWithGoogle = async (
    email: string,
    name: string,
    photo: string,
    req: Request,
    res: Response,
    extra: string
  ) => {
    let password = uuidv4();

    let role = undefined;
    if (extra == "freelancer") {
      role = Roles.freelancer;
    }

    if (extra == "hire") {
      role = Roles.hire;
    }

    const newUser = await this.service?.post({
      id: "",
      photo: photo,
      createdDate: new Date(),
      updatedDate: new Date(),
      name: name,
      email: email,
      password: password,
      passwordConfirm: password,
      gender: Gender.None,
      active: true,
      role: role,
      experience: 0,
      technology: [],
    });

    const url = `${req.protocol}://${req.get("host")}/me`;
    // console.log(url);
    //@Production : Email
    await new Email(newUser, url).sendWelcome();

    return this.createSendToken(newUser, 201, req, res, extra);
  };

  loginWithSocialLogin = async (
    email: string,
    name: string,
    photo: string,
    req: Request,
    res: Response,
    extra: string
  ) => {
    const isEmail = validator.validate(email);

    // 1) Check is email valid.
    if (!isEmail) {
      console.log("not a email in google login.");
      throw new AppError("Internal Server Error", 500);
    }

    // 2) Check if user exists && password is correct
    const user = await this.service?.findOneDocument({ email });

    console.log(user);

    console.log("step 2 finding user ");

    if (user) {
      if (user?.role != Roles[extra as keyof typeof Roles]) {
        await this.service?.update(
          user?.id,
          {
            role: Roles[extra as keyof typeof Roles],
          },
          ["role"]
        );
      }
    }

    if (!user) {
      console.log("step 3 crating user ");
      return this.signUpWithGoogle(email, name, photo, req, res, extra);
    }

    // 3) If everything ok, send token to client
    this.createSendToken(user, 200, req, res, extra);
  };

  loginWithPhone = async (
    email: string,
    name: string,
    photo: string,
    req: Request,
    res: Response,
    extra: string
  ) => {
    const isEmail = validator.validate(email);

    // 1) Check is email valid.
    if (!isEmail) {
      console.log("not a email in google login.");
      throw new AppError("Internal Server Error", 500);
    }

    // 2) Check if user exists && password is correct
    const user = await this.service?.findOneDocument({ email });

    console.log("step 2 finding user ");

    if (user) {
      if (user?.role != Roles[extra as keyof typeof Roles]) {
        await this.service?.update(
          user?.id,
          {
            role: Roles[extra as keyof typeof Roles],
          },
          ["role"]
        );
      }
    }

    if (!user) {
      console.log("step 3 crating user ");
      return this.signUpWithGoogle(email, name, photo, req, res, extra);
    }

    // 3) If everything ok, send token to client
    this.createSendToken(user, 200, req, res, extra);
  };

  logout = catchAsync(async (req: Request, res: Response) => {
    console.log("logout called");

    res.cookie("jwt", "", {
      expires: new Date(Date.now() - 1),
      maxAge: 0,
      httpOnly: true,
      secure: true,
      domain: ".developerext.com",
      sameSite: "none", // Required for cross-origin cookies
      path: "/", // Set the appropriate path
    });

    // res.clearCookie("jwt", {
    //   httpOnly: true,
    //   secure: false,
    //   domain: "localhost",
    //   path: "/",
    // });

    res.status(200).json({ status: "success" });
  });

  protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1) Getting token and check of it's there
      let token;
      console.log("Protected Route", req.headers);
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      console.log(req.cookies.jwt);

      // console.log("token", token);

      if (!token) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        );
      }

      // 2) Verification token
      let decoded: any;
      try {
        decoded = await promisify(jwt.verify)(
          token,
          getEnv(EnvEnumType.JWT_SECRET)
        );
      } catch (err) {
        decoded = { id: "            " };
      }

      // console.log(decoded);

      // 3) Check if user still exists
      const currentUser = await this.service?.getDocumentById(decoded.id);
      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token does no longer exist.",
            401
          )
        );
      }

      // CHECK :
      // 4)  Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError(
            "User recently changed password! Please log in again.",
            401
          )
        );
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser as IUser;
      res.locals.user = currentUser as IUser;
      console.log(req.user);
      next();
    }
  );

  protectSocket = async (token: string) => {
    // 1) Getting token and check of it's there

    console.log("token", token);

    // console.log("token", token);

    if (!token) {
      return {
        message: "You are not logged in! Please log in to get access. 401",
        success: false,
        user: null,
      };
    }

    // 2) Verification token
    let decoded: any;
    try {
      decoded = await promisify(jwt.verify)(
        token,
        getEnv(EnvEnumType.JWT_SECRET)
      );
    } catch (err) {
      decoded = { id: "            " };
    }

    // console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await this.service?.getDocumentById(decoded.id);
    if (!currentUser) {
      return {
        message: "You are not logged in! Please log in to get access. 401",
        success: false,
        user: null,
      };
    }

    // CHECK :
    // 4)  Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return {
        message: "You are not logged in! Please log in to get access. 401",
        success: false,
        user: null,
      };
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    return {
      message: "success",
      user: currentUser,
      success: true,
    };
  };

  protectGrqphQL = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let isAuthRequired: any = req.query.auth;

      // console.log("is Auth Required ", isAuthRequired);

      // if (!isAuthRequired) {
      //   return next();
      // }

      // IMPORTANT: 891218775666826437ec6c0ac
      // if this string is equal : then authentication is not required for
      // the query . just to bypass the authentication process ... if not required .
      // instead of wasting the processing resources .

      if (isAuthRequired === "false") {
        return next();
      }

      console.log("Is Auth Skipped :", false);

      // 1) Getting token and check of it's there
      let token;
      // console.log("Protected Route");
      console.log(req.headers);
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      // 2) Verification token
      let decoded: any;
      try {
        decoded = await promisify(jwt.verify)(
          token,
          getEnv(EnvEnumType.JWT_SECRET)
        );
      } catch (err) {
        decoded = { id: "            " };
      }

      // console.log(decoded);

      // 3) Check if user still exists
      const currentUser = await this.service?.getDocumentById(decoded.id);

      // CHECK :
      // 4)  Check if user changed password after the token was issued
      if (currentUser) {
        if (currentUser.changedPasswordAfter(decoded.iat)) {
        } else {
          // GRANT ACCESS TO PROTECTED ROUTE
          req.user = currentUser as IUser;

          let extractedUserId = req.user._id
            ?.toString()
            .replace('new ObjectId("', "");

          extractedUserId = extractedUserId?.replace('"', "");

          req.user.id = extractedUserId;
          res.locals.user = currentUser as IUser;
          console.log(req.user);
        }
      }
      next();
    }
  );

  // Only for rendered pages, no errors!
  isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          getEnv(EnvEnumType.JWT_SECRET)
        );

        // 2) Check if user still exists
        const currentUser = await this.service?.getDocumentById(decoded.id);
        if (!currentUser) {
          return next();
        }

        // CHECK :
        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }

        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser as IUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

  restrictTo = (...roles: String[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (req.user) {
        if (req.user.role) {
          if (!roles.includes(Roles[req.user.role])) {
            return next(
              new AppError(
                "You do not have permission to perform this action",
                403
              )
            );
          }
        }
      }

      next();
    };
  };

  forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await this.service?.findOneDocument({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    // CHECK :
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
      if (allValidator.isEmail(req.body.email)) {
        const resetURL = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/user/resetPassword/${resetToken}`;

        await new Email(user, resetURL).sendPasswordReset();
      }

      if (
        allValidator.isMobilePhone(req.body.email, "en-IN", {
          strictMode: false,
        })
      ) {
      }

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = "";
      user.passwordResetExpires = undefined;
      // CHECK :
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  });

  resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const extra = req.params.extra;

    const user = await this.service?.findOneDocument({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = "";
    user.passwordResetExpires = undefined;
    // CHECK :
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    this.createSendToken(user, 200, req, res, extra);
  });

  updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1) Get user from collection
      const user = await this.service?.getById(req.user?.id, "+password");
      const extra = req.body.extra;

      if (user) {
        // CHECK :
        // // 2) Check if POSTed current password is correct
        // if (
        //   !(await user.correctPassword(req.body.passwordCurrent, user.password))
        // ) {
        //   return next(new AppError("Your current password is wrong.", 401));
        // }

        // 3) If so, update password
        await this.service?.update(user.id, {
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
        });
        // User.findByIdAndUpdate will NOT work as intended!

        // 4) Log user in, send JWT
        this.createSendToken(user, 200, req, res, extra);
      }
    }
  );



  


  uploadImage = catchAsync(async (req: any, res: any, next: any) => {
    upload(req, res, async (err: any) => {
      console.log(err);

      if (err) {
        res.send({ message: err });
      } else {
        if (req.file == undefined) {
          res.send({ message: "No file selected!" });
        } else {
          try {
            console.log(req.file.filename);

            const userId = req.user._id;

            const inputPathForResize = req.file.path;
            const outputFileNameForResize = `resized-${req.file.filename}`;
            const outputPathForResize = path.join(req.file.destination, outputFileNameForResize);
          



            // Find the user and get the current photo filename
            const user = await User.findById(userId);
            const previousPhoto = user.photo;

            await User.findByIdAndUpdate(userId, { photo: req.file.filename });

            // Delete previous photo if it exists and is different from the new one
            if (previousPhoto && previousPhoto !== req.file.filename) {
              // Delete previous photo file (assuming you have stored it in a specific directory)
              // You may need to adjust this path according to your file storage structure
              const filePath = path.join(
                __dirname,
                "../../public/images/" + previousPhoto
              );

              const resizedFilePath = path.join(
                __dirname,
                "../../public/images/" + "resized-" + previousPhoto
              );

              // Asynchronously delete the file
              fs.unlink(filePath, (unlinkErr: any) => {
                if (unlinkErr) {
                  logger.exceptionError(
                    `Error deleting previous photo ${previousPhoto}: ${unlinkErr}`
                  );
                } else {
                  console.log(`Deleted previous photo: ${previousPhoto}`);
                }
              });

               // Asynchronously delete the file
               fs.unlink(resizedFilePath, (unlinkErr: any) => {
                if (unlinkErr) {
                  logger.exceptionError(
                    `Error deleting previous photo ${previousPhoto}: ${unlinkErr}`
                  );
                } else {
                  console.log(`Deleted previous photo: ${previousPhoto}`);
                }
              });
            }


            try {

              const width = 60 ;
              const height = 60 ;
            
          
              await sharp(inputPathForResize)
                .resize(width, height)
                .toFile(outputPathForResize);
          
            } catch (error:any) {
              res.status(500).send(`Error processing image: ${error.message}`);
            }
          

            console.log(
              `New photo uploaded for user ${userId}: ${req.file.filename}`
            );

            console.log(user, {
              data: { user: { _id: user._id, photo: `/${req.file.filename}` } },
            });

            res.send({
              message: "File uploaded!",
              data: { user: { _id: user._id, photo: `/${req.file.filename}` } },
            });
          } catch (error) {
            console.log(error);

            res.status(500).send({
              message: "Error saving file information to the database.",
            });
          }
        }
      }
    });
  });
}
