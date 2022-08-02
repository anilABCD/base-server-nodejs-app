import isProductionEnvironment from "../utils/isProductionEnvironment";

export default class AppError extends Error {
  statusCode: Number = 0;
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
      if (err) {
        if (err.errors && err.errors.length > 0) {
          this.message = err.errors[0].message;
          this.statusCode = statusCode;
          this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
          this.isOperational = true;
        }
      }
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
