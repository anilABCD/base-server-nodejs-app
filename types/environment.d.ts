declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DATABASE_URL: string;
      DATABASE_PASSWORD: string;
      ENV: "test" | "dev" | "prod";
      USER: number;
    }
  }
}

export {};
