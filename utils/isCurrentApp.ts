import TypeCurrentAppNames from "../enums/TypeCurrentAppNames";
import getEnv, { EnvEnumType } from "../env/getEnv";

export default function isCurrentApp(currentApp: TypeCurrentAppNames) {
  if (getEnv(EnvEnumType.CURRENT_APP) === currentApp) {
    return true;
  }

  return false;
}
