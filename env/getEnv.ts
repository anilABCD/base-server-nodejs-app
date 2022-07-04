import isProductionEnvironment from "../utils/isProductionEnvironment";
import console from "../utils/console";

type NODE_SERVER_PORT = "NODE_SERVER_PORT";
type DATABASE_URL = "DATABASE_URL";

export enum EnvEnumType {
  // ENVIRONMENT / SERVER : @Development
  "PORT",
  // DATABASE
  "DATABASE_URL",
  "DATABASE_PASSWORD",
  // JWT
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "JWT_COOKIE_EXPIRES_IN",
  // From Email Information ( From company email , From company name )
  "EMAIL_FROM",
  "EMAIL_FROM_FULL_NAME",
  // TEMP EMAIL : @Development
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USERNAME",
  "EMAIL_PASSWORD",
  // SEND GRID : @Production
  "SENDGRID_USERNAME",
  "SENDGRID_PASSWORD",
}

function getEnv(name: EnvEnumType) {
  return process.env[EnvEnumType[name]];
}

function privateFunctionGetEnvNotForUseThisIsNotTypeSafe(name: string) {
  // IMPORTANT: return process.env[name] is returning the object
  // IMPORTANT: So below method is correct ... use only the below mehtod ...
  // IMPORTANT: let envValue = process.env[name];
  let envValue = process.env[name];
  return envValue;
}

function checkIfAnyThingMissionInProduction(): boolean {
  if (isProductionEnvironment()) {
    const notUsedInProductionValue = "This:IsADefaultValue";
    let wrongEnvElements = Object.keys(EnvEnumType).filter((element) => {
      if (isNaN(parseInt(element))) {
        // console.log(element);
        // console.log(
        //   privateFunctionGetEnvNotForUseThisIsNotTypeSafe(element),
        //   notUsedInProductionValue
        // );
        return (
          privateFunctionGetEnvNotForUseThisIsNotTypeSafe(element) ===
          notUsedInProductionValue
        );
      } else {
        return false;
      }
    });

    console.log(wrongEnvElements);

    if (wrongEnvElements.length > 0) {
      return false;
    }
  }

  return true;
}

export default getEnv;
export { checkIfAnyThingMissionInProduction };

// type EnvNamesType =
//   // ENVIRONMENT / SERVER : @Development
//   | NODE_SERVER_PORT
//   // DATABASE
//   | "DATABASE_URL"
//   | "DATABASE_PASSWORD"
//   // JWT
//   | "JWT_SECRET"
//   | "JWT_EXPIRES_IN"
//   | "JWT_COOKIE_EXPIRES_IN"
//   // From Email Information ( From company email , From company name )
//   | "EMAIL_FROM"
//   | "EMAIL_FROM_FULL_NAME"
//   // TEMP EMAIL : @Development
//   | "EMAIL_HOST"
//   | "EMAIL_PORT"
//   | "EMAIL_USERNAME"
//   | "EMAIL_PASSWORD"
//   // SEND GRID : @Production
//   | "SENDGRID_USERNAME"
//   | "SENDGRID_PASSWORD";
