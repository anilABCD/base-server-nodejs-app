import logger from "../utils/logger";
import verifyEmailTemplates from "./verifyAllEmailTemplates";
import verifyAllEnvVariables from "./verifyAllEnvVariables";
import console from "../utils/console";

function isAllResourcesReady(): boolean {
  try {
    console.verify("\n\n******** START VERIFICATION ************\n\n");
    let envOk = verifyAllEnvVariables();
    let emailTemplatesOk = verifyEmailTemplates();

    if (!envOk) {
      console.verify("Env failed not OK");
      logger.resourceNotFoundError("ENV Variables", "CANT START SERVER");
    }

    if (!emailTemplatesOk) {
      console.verify("Email Templates not OK");
      logger.resourceNotFoundError("EMAIL TEMPLATES", "CANT START SERVER");
    }

    if (envOk && emailTemplatesOk) {
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

export default isAllResourcesReady;
