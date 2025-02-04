import IUser from "../interfaces/user.interfaces/user.interface";
declare global {
  namespace NodeJS {
    interface Process {
      PORT: number;
      DATABASE_URL: string;
      DATABASE_PASSWORD: string;
      ENV: "test" | "development" | "production";
      USER: number;
      EMAIL_HOST: String;
      EMAIL_PORT: number;
      JWT_COOKIE_EXPIRES_IN: number;
    }
  }
  declare namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}

export {};
