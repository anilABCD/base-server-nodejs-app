import TypeCurrentProject from "../enums/TypeCurrentProject";
import getEnv, { EnvEnumType } from "../env/getEnv";

export default function isCurrentApp(myCurrentApp: string) {
  if (getEnv(EnvEnumType.CURRENT_PROJECT) === myCurrentApp) {
    return true;
  }

  return false;
}
