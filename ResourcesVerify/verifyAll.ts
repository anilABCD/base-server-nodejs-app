import logger from "../utils/logger";
import verifyEmailTemplates from "./verifyAllEmailTemplates";
import verifyAllEnvVariables from "./verifyAllEnvVariables";

function isAllResourcesReady(): boolean {
  try {
    let envOk = verifyAllEnvVariables();
    let emailTemplatesOk = verifyEmailTemplates();

    if (!envOk) {
      logger.resourceNotFoundError("ENV Variables", "CANT START SERVER");
    }

    if (!emailTemplatesOk) {
      logger.resourceNotFoundError("EMAIL TEMPLATES", "CANT START SERVER");
    }

    if (envOk && emailTemplatesOk) {
      return true;
    } else {
      logger.programmingError("CANT START SERVER");

      return false;
    }
  } catch (err) {
    logger.exceptionError("CANT START SERVER :", JSON.stringify(err));
  }

  logger.programmingError("CANT START SERVER");
  return false;
}

export default isAllResourcesReady;
