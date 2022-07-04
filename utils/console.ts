import { singleton } from "tsyringe";
import getEnv from "../.env/getEnv";

@singleton()
class MyConsole {
  log = (message?: any, ...extras: any[]) => {
    // IMPORTANT: dont use getEnv("ENV") here because : process.env.ENV has type in environment.d.ts
    if (process.env.ENV === "dev") {
      if (extras.length > 0) {
        return console.log(message, extras);
      } else {
        return console.log(message);
      }
    }
  };
}

export default new MyConsole();
