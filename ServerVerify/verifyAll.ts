import logger from "../utils/logger";
import verifyEmailTemplates from "./verifyAllEmailTemplates";
import verifyAllEnvVariables from "./verifyAllEnvVariables";

function isServerReady(): boolean {
  try {
    if (verifyAllEnvVariables() && verifyEmailTemplates()) {
      return true;
    }
  } catch (err) {
    logger.error("SERVER NOT STARTING", JSON.stringify(err));
  }
  return false;
}

export default isServerReady;
