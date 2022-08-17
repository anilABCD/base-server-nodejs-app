import getEnv, { EnvEnumType } from "../env/getEnv";

function getCurrentApp() {
  return getEnv(EnvEnumType.CURRENT_APP)?.replace("-", ".");
}

export default getCurrentApp;
