import TypeCurrentProject from "../enums/TypeCurrentProject";
import getEnv, { EnvEnumType } from "../env/getEnv";

export default function isCurrentApp(myCurrentApp: TypeCurrentProject) {
  if (getEnv(EnvEnumType.CURRENT_PROJECT) === myCurrentApp) {
    return true;
  }

  return false;
}
