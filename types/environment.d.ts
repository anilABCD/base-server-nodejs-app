import UserModelSI from "../interfaces/user.interfaces/user.interface";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DATABASE_URL: string;
      DATABASE_PASSWORD: string;
      ENV: "test" | "dev" | "prod";
      USER: number;
      EMAIL_HOST: String;
      EMAIL_PORT: number;
      JWT_COOKIE_EXPIRES_IN: number;
    }
  }
  declare namespace Express {
    export interface Request {
      user?: UserModelSI;
    }
  }
}

export {};
