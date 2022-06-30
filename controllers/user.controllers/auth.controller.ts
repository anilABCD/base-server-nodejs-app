import { autoInjectable } from "tsyringe";
import BaseController from "../base.controller";

import { Request, Response, NextFunction } from "express";

const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
// usermodel
import catchAsync from "../../ErrorHandling/catchAsync";
import AppError from "../../ErrorHandling/AppError";
import Email from "../../utils/email";
import AuthService from "../../services/user.services/auth.service";
import UserModelSI from "../../interfaces/user.interfaces/user.interface";
import { Roles } from "../../model.types/user.model.types";

@autoInjectable()
export default class AuthController extends BaseController {
  constructor(service?: AuthService) {
    super(service);
  }

  signToken = (id: String) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  createSendToken = (
    user: UserModelSI,
    statusCode: number,
    req: Request,
    res: Response
  ) => {
    const token = this.signToken(user._id);

    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    // Remove password from output
    user.password = "";

    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  };

  signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const newUser = await this.service?.post({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });

      const url = `${req.protocol}://${req.get("host")}/me`;
      // console.log(url);
      await new Email(newUser, url).sendWelcome();

      this.createSendToken(newUser, 201, req, res);
    }
  );

  login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      // 1) Check if email and password exist
      if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
      }
      // 2) Check if user exists && password is correct
      const user = await this.service?.findOne({ email }, "+password");

      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
      }

      // 3) If everything ok, send token to client
      this.createSendToken(user, 200, req, res);
    }
  );

  logout = catchAsync(async (req: Request, res: Response) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: "success" });
  });

  protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1) Getting token and check of it's there
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        );
      }

      // 2) Verification token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      const currentUser = await this.service?.getById(decoded.id);
      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token does no longer exist.",
            401
          )
        );
      }

      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError(
            "User recently changed password! Please log in again.",
            401
          )
        );
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      res.locals.user = currentUser;
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
          process.env.JWT_SECRET
        );

        // 2) Check if user still exists
        const currentUser = await this.service?.getById(decoded.id);
        if (!currentUser) {
          return next();
        }

        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }

        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
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
        if (!roles.includes(Roles[req.user.role])) {
          return next(
            new AppError(
              "You do not have permission to perform this action",
              403
            )
          );
        }
      }

      next();
    };
  };

  forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await this.service?.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
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

    const user = await this.service?.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    this.createSendToken(user, 200, req, res);
  });

  updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1) Get user from collection
      const user = await this.service?.getById(req.user?.id, "+password");

      // 2) Check if POSTed current password is correct
      if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
      ) {
        return next(new AppError("Your current password is wrong.", 401));
      }

      // 3) If so, update password
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      await user.save();
      // User.findByIdAndUpdate will NOT work as intended!

      // 4) Log user in, send JWT
      this.createSendToken(user, 200, req, res);
    }
  );
}

//#region  OLD Code :
// import AppError from "../ErrorHandling/AppError";
// import catchAsync from "../ErrorHandling/catchAsync";
// import QuizeCategory from "../Model/quize.category.model";
// import filterObject from "../utils/filterObj.util";

// import { Request, Response, NextFunction } from "express";

// const getAllQuizes = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const quizeCategories = await QuizeCategory.find();
//     res.status(200).json(quizeCategories);
//   }
// );

// const getQuize = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const quizeCategory = await QuizeCategory.findById(req.params.id);

//     if (!quizeCategory) {
//       next(new AppError("Quize not found", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         quizeCategory,
//       },
//     });
//   }
// );

// const createQuize = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const newQuizeCategory = new QuizeCategory();
//     newQuizeCategory.key = req.body.topic; //key
//     await newQuizeCategory.save();

//     // 201 created
//     res.status(201).json({
//       status: "success",
//       data: {
//         quizeCategory: newQuizeCategory,
//       },
//     });
//   }
// );

// const updateQuize = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const filteredBody = filterObject(req.body, ["key"]);

//     const updatedQuizeCateogry = await QuizeCategory.findByIdAndUpdate(
//       req.params.id,
//       filteredBody,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         updatedQuizeCateogry,
//       },
//     });
//   }
// );

// export { getAllQuizes };
// export { getQuize };
// export { createQuize };
// export { updateQuize };
//#endregion
