//IMPORTANT: Dont export this funciton anywhere else .

import isProductionEnvironment from "../utils/isProductionEnvironment";
import { EnvEnumType } from "../env/getEnv";

//IMPORTANT: I did not export this function for safety .
function privateFunctionGetEnvNotForUseThisIsNotTypeSafe(name: string) {
  // IMPORTANT: return process.env[name] is returning the object
  // IMPORTANT: So below method is correct ... use only the below mehtod ...
  // IMPORTANT: let envValue = process.env[name];
  let envValue = process.env[name];
  return envValue;
}

function verifyAllEnvVariables(): boolean {
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

export default verifyAllEnvVariables;
