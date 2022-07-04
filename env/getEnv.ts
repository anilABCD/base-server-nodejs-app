import isProductionEnvironment from "../utils/isProductionEnvironment";
import console from "../utils/console";

import path from "path";
import fs, { readdirSync } from "fs";
import util from "util";

import logger from "../utils/logger";

const readdir = util.promisify(fs.readdir);

const templateFilesRequiredForEmail = path.join(__dirname, "../views/email/");

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

export enum EmailTemplatesEnumType {
  // Style.pug
  "_style.pug",

  // Base Email
  "baseEmail.pug",

  // Password Reset Template
  "passwordReset.pug",

  // On sign up // welcome message pug Template .
  "welcome.pug",
}

function getEnv(name: EnvEnumType) {
  return process.env[EnvEnumType[name]];
}

//IMPORTANT: Dont export this funciton anywhere else .
//IMPORTANT: I did not export this function for safety .
function privateFunctionGetEnvNotForUseThisIsNotTypeSafe(name: string) {
  // IMPORTANT: return process.env[name] is returning the object
  // IMPORTANT: So below method is correct ... use only the below mehtod ...
  // IMPORTANT: let envValue = process.env[name];
  let envValue = process.env[name];
  return envValue;
}

function allEmailTemplatesRead(): boolean {
  let files = readdirSync(templateFilesRequiredForEmail);

  // WARN : Object.keys( EmailTemplatesEnumType ) will get : keys and also their indexes .
  // WARN : For 4 keys we get 8 keys including their index
  const verifiedFilesDataWithoutIndexes = Object.keys(
    EmailTemplatesEnumType
  ).filter((fileName) => {
    if (isNaN(parseInt(fileName))) {
      return true;
    }
    return false;
  });

  const verifiedFiles = verifiedFilesDataWithoutIndexes.map(
    (fileName, i: number) => {
      const file = files.filter((file: string) => {
        return file === fileName;
      })[0];

      return file;
    }
  );

  return verifiedFiles.length === verifiedFilesDataWithoutIndexes.length;
}

function allEnvironmentVariablesReady(): boolean {
  if (isProductionEnvironment()) {
    const notUsedInProductionValue = "This:IsADefaultValue";
    let wrongEnvElements = Object.keys(EnvEnumType).filter((element) => {
      if (isNaN(parseInt(element))) {
        let envValue = privateFunctionGetEnvNotForUseThisIsNotTypeSafe(element);

        if (!envValue) {
          return false;
        }

        if (envValue.trim() == "") {
          return false;
        }

        return envValue === notUsedInProductionValue;
      } else {
        return false;
      }
    });

    if (wrongEnvElements.length > 0) {
      return false;
    }
  }

  return true;
}

function allReady(): boolean {
  try {
    if (allEnvironmentVariablesReady() && allEmailTemplatesRead()) {
      return true;
    }
  } catch (err) {
    logger.error("SERVER NOT STARTING", JSON.stringify(err));
  }
  return false;
}

export default getEnv;
export { allReady };
