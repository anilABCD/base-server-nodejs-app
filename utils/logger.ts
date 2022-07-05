import isProductionEnvironment from "./isProductionEnvironment";

import { Logger } from "logger";

class MyLogger extends Logger {
  constructor(logFileName: string) {
    super(logFileName);
  }

  resourceNotFoundError = (...extraParam: string[]) => {
    this.error(
      "Resource not found  ERROR : ",
      ...extraParam,
      String(ErrorCodeEnumType.ResourceNotFound)
    );
  };

  exceptionError = (...extraParam: string[]) => {
    this.error(
      "Exception ERROR :",
      ...extraParam,
      String(ErrorCodeEnumType.Exception)
    );
  };

  programmingError = (...extraParam: string[]) => {
    this.error(
      "Programming ERROR : by coder :",
      ...extraParam,
      String(ErrorCodeEnumType.Programming)
    );
  };
}

const logger = new MyLogger(
  isProductionEnvironment()
    ? `${__dirname}/../logs/production.log`
    : `${__dirname}/../logs/development.log`
);

enum ErrorCodeEnumType {
  Programming = 10001,
  Exception = 10002,
  ResourceNotFound = 10003,
}

logger.exceptionError("hello exception");

export default logger;
