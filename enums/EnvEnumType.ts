enum EnvEnumType {
  // ENVIRONMENT / SERVER : @Development
  "PORT",
  // DATABASE
  "DATABASE_URL",
  "DATABASE_PASSWORD",
  // JWT
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "JWT_COOKIE_EXPIRES_IN",
  // From Email Information ( From company email , From company name )
  "EMAIL_FROM",
  "EMAIL_FROM_FULL_NAME",
  // TEMP EMAIL : @Development
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USERNAME",
  "EMAIL_PASSWORD",
  // SEND GRID : @Production
  "SENDGRID_USERNAME",
  "SENDGRID_PASSWORD",
}

export default EnvEnumType;
