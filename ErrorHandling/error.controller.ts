import { Request, Response, NextFunction } from "express";
import console from "../utils/console";
import AppError from "./AppError";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: AppError, res?: Response) => {
  const errorInfo = {
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  };

  if (res) {
    return res.status(err.statusCode).json({
      ...errorInfo,
    });
  }

  return {
    ...errorInfo,
  };
};

const sendErrorProd = (err: AppError, res?: Response) => {
  // Operational, trusted error: send message to client

  const errorInfo = {
    status: err.status,
    message: err.message,
    statusCode: err.statusCode,
  };

  const errorSomethingWentWrong = {
    status: "error",
    message: "Something went very wrong!",
    statusCode: 500,
  };

  if (res) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        ...errorInfo,
      });

      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error("ERROR 💥", err);

      // 2) Send generic message
      return res.status(500).json({
        ...errorSomethingWentWrong,
      });
    }
  }

  if (err.isOperational) {
    return errorInfo;
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return errorSomethingWentWrong;
  }
};

const errorController = (
  err: any,
  req?: Request,
  res?: Response,
  next?: NextFunction
) => {
  /////////////////////////////////////////////////////////////////////
  //
  console.log("\n\n**********From Error Controller ********\n\n");
  //
  /////////////////////////////////////////////////////////////////////

  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

export default errorController;
