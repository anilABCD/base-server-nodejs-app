import logger from "../utils/logger";
import verifyEmailTemplates from "./verifyAllEmailTemplates";
import verifyAllEnvVariables from "./verifyAllEnvVariables";
import console from "../utils/console";
import getEnv, { EnvEnumType } from "../env/getEnv";
import TypeCurrentAppNames from "../enums/TypeCurrentAppNames";

function isAllResourcesReady(): boolean {
  try {
    console.verify("\n\n******** START VERIFICATION ************\n\n");
    let envOk = verifyAllEnvVariables();
    let emailTemplatesOk = verifyEmailTemplates();

    let currentProcectOk = verifyProjectNameOK();

    if (!envOk) {
      console.verify("Env failed not OK");
      logger.resourceNotFoundError("ENV Variables", "CANT START SERVER");
    }

    if (!emailTemplatesOk) {
      console.verify("Email Templates not OK");
      logger.resourceNotFoundError("EMAIL TEMPLATES", "CANT START SERVER");
    }

    if (!currentProcectOk) {
      console.verify("Current Project Name Not OK");
      logger.resourceNotFoundError("ENV Variables", "CANT START SERVER");
    }

    if (envOk && emailTemplatesOk && currentProcectOk) {
      console.verify("All Verify OK");
      return true;
    } else {
      logger.programmingError("CANT START SERVER");
      return false;
    }
  } catch (err) {
    console.verify("All Failed", err);
    logger.exceptionError("CANT START SERVER :", JSON.stringify(err));
  }

  logger.programmingError("CANT START SERVER");
  console.verify("All Failed");
  return false;
}

function verifyProjectNameOK() {
  let values: TypeCurrentAppNames[] = [
    "messaging-app",
    "quize-app",
    "dating-kairo-app",
    "devos-app",
  ];

  const allProjectNames = values.join(",").split(",");

  const CURRENT_APP = getEnv(EnvEnumType.CURRENT_APP) || "";

  if (allProjectNames.indexOf(CURRENT_APP) > -1) {
    return true;
  }

  return false;
}

export default isAllResourcesReady;
