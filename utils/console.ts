import { singleton } from "tsyringe";
import isOnlyDevelopmentEnvironment from "./isOnlyDevelopmentEnvironment";
import isProductionEnvironment from "./isProductionEnvironment";
import logger from "./logger";
import RegexExtract from "./RegexExtract";

let showVerfify = false;
let enableConsoleLog = true;
let enableDecoratorLog = false;

type VerboseText = "verbose-mode";
function VerboseText(str: VerboseText) {
  return str;
}

var log = console.log;

//
// eg: to use in console.error()
// console.error("trace");
// "trace" message is compulsory to show trace ...
//

//@ts-ignore
console.error2 = function () {
  //@ts-ignore
  this.error.apply(console, arguments);
  // Print the stack trace

  console.trace();
};

@singleton()
class MyConsole {
  decorator = (message?: any, ...extras: any[]) => {
    if (isOnlyDevelopmentEnvironment() || isProductionEnvironment()) {
      if (enableDecoratorLog) {
        if (extras.length > 0) {
          return console.log(message, extras);
        } else {
          return console.log(message);
        }
      }
    }
  };

  clear = () => {
    // console.clear();
  };

  setShowVerify = () => {
    showVerfify = true;
  };

  required = (message?: any, ...extras: any[]) => {
    if (isOnlyDevelopmentEnvironment() || isProductionEnvironment()) {
      if (extras.length > 0) {
        return console.log(message, extras);
      } else {
        return console.log(message);
      }
    }
  };

  log = (message?: any, ...extras: any[]) => {
    if (isOnlyDevelopmentEnvironment() || isProductionEnvironment()) {
      if (enableConsoleLog) {
        if (extras.length > 0) {
          console.log(message, extras);
        } else {
          console.log(message);
        }

        //
        //
        if (message === VerboseText("verbose-mode")) {
          this.logErrorFileAndLineNumber();
        }
        //
        //

        return;
      }
    }
  };

  getVerboseModeText() {
    return VerboseText("verbose-mode");
  }

  verbose(message?: any, ...extras: any[]) {
    let verboseMode = this.getVerboseModeText();
    this.log(verboseMode, message, extras);
  }

  //private getStackTrace() {
  //   var obj = { stack: "" };
  //   Error.captureStackTrace(obj, this.getStackTrace);
  //   console.log(" @Stack Trace : ",  obj.stack);
  //   return obj.stack;
  // }

  logErrorFileAndLineNumber = () => {
    let result = RegexExtract.ErrorInfo(new Error().stack);
    console.log("\nLine Number : ", result, "\n\n");

    try {
      throw new Error("@");
    } catch (err) {
      // console.log(
      //   "\n Log_Error_File_And_Line_Number Error() : \n",
      //   err,
      //   "\n\n"
      // );
    }
  };

  clearAfter = (code: string) => {
    console.log("\n@@@@@@@@", code, "@@@@@@@@\n");

    this.logErrorFileAndLineNumber();

    enableConsoleLog = false;
    setTimeout(() => {
      enableConsoleLog = true;
    }, 3000);
  };

  // log = (message?: any, ...extras: any[]) => {
  //   if (isOnlyDevelopmentEnvironment() || isProductionEnvironment()) {
  //     if (extras.length > 0) {
  //       return console.log(message, extras);
  //     } else {
  //       return console.log(message);
  //     }
  //   }
  // };

  verify = (message?: any, ...extras: any[]) => {
    // IMPORTANT: dont use getEnv("ENV") here because : process.env.ENV has type in environment.d.ts

    if (message === "All Failed") {
      return console.log(" VERIFY : ", message, extras);
    }

    // @ts-ignore
    if (showVerfify === true) {
      if (extras.length > 0) {
        return console.log("VERIFY : ", message, extras);
      } else {
        return console.log("VERIFY : ", message);
      }
    }
  };

  error = (message?: any, ...extras: any[]) => {
    // IMPORTANT: dont use getEnv("ENV") here because : process.env.ENV has type in environment.d.ts
    if (process.env.ENV === "development") {
      if (extras.length > 0) {
        logger.exceptionError(message, ...extras);

        //@ts-ignore
        return console.error2(message, extras);
      } else {
        logger.exceptionError(message);

        //@ts-ignore
        return console.error2(message);
      }
    }
  };
}

export default new MyConsole();
