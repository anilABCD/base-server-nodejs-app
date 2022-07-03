import { singleton } from "tsyringe";

@singleton()
class MyConsole {
  log = (message?: any, ...extras: any[]) => {
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
