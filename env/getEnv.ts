import EnvEnumType from "../enums/EnvEnumType";

function getEnv(name: EnvEnumType) {
  return process.env[EnvEnumType[name]];
}

export default getEnv;

export { EnvEnumType };
