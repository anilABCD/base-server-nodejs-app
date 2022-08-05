import isProductionEnvironment from "../utils/isProductionEnvironment";

export default class AppError extends Error {
  statusCode: number = 0;
  status: String = "";
  isOperational: Boolean = false;
  message: string = "";

  constructor(message: string, statusCode: number, err?: any) {
    super(message);

    if (isProductionEnvironment()) {
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;
    }

    if (!isProductionEnvironment()) {
      this.message = message;
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;
    }

    if (err) {
      console.log("error", err);
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
