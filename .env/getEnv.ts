type EnvNames =
  // ENVIRONMENT / SERVER
  | "NODE_SERVER_PORT"
  // DATABASE
  | "DATABASE_URL"
  | "DATABASE_PASSWORD"
  // JWT
  | "JWT_SECRET"
  | "JWT_EXPIRES_IN"
  | "JWT_COOKIE_EXPIRES_IN"
  // TEMP EMAIL
  | "EMAIL_FROM"
  | "EMAIL_FROM_FULL_NAME"
  | "EMAIL_HOST"
  | "EMAIL_PORT"
  | "EMAIL_USERNAME"
  | "EMAIL_PASSWORD"
  // SEND GRID : @Production
  | "SENDGRID_USERNAME"
  | "SENDGRID_PASSWORD";

function getEnv(name: EnvNames) {
  // console.log(
  //   String(process.env.EMAIL_HOST),
  //   process.env.EMAIL_PORT,
  //   process.env.EMAIL_USERNAME,
  //   process.env.EMAIL_PASSWORD
  // );
  return process.env[name];
}

export default getEnv;
