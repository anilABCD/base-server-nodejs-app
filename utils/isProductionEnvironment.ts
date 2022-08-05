import getEnv from "../env/getEnv";

const isProductionEnvironment = (): boolean => {
  // IMPORTANT: dont use getEnv("ENV") here because : process.env.ENV has type in environment.d.ts
  return process.env.ENV === "production";
};

export default isProductionEnvironment;
