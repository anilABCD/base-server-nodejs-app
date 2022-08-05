import { singleton } from "tsyringe";

let showVerfify = false;

@singleton()
class MyConsole {
  clear = () => {
    console.clear();
  };

  setShowVerify = () => {
    showVerfify = true;
  };

  required = (message?: any, ...extras: any[]) => {
    if (process.env.ENV === "development" || process.env.ENV === "production") {
      if (extras.length > 0) {
        return console.log(message, extras);
      } else {
        return console.log(message);
      }
    }
  };

  log = (message?: any, ...extras: any[]) => {
    // IMPORTANT: dont use getEnv("ENV") here because : process.env.ENV has type in environment.d.ts
    if (process.env.ENV === "development" || process.env.ENV === "production") {
      if (extras.length > 0) {
        return console.log(message, extras);
      } else {
        return console.log(message);
      }
    }
  };

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
        return console.error(message, extras);
      } else {
        return console.error(message);
      }
    }
  };
}

export default new MyConsole();
