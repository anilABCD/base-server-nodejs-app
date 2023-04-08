export enum Roles {
  "user" = "user",
  "admin" = "admin",
  "freelancer" = "freelancer",
  "hire" = "hire",
}

export interface RolesEnum {
  [key: string]: Roles;
}

export enum Gender {
  "male" = "male",
  "female" = "female",
  "prefer-not-to-say" = "prefer-not-to-say",
  "None" = "",
}
