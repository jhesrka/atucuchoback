import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  DB_HOST: get("HOST_DATABASE").required().asString(),
  DB_USERNAME: get("USERNAME_DATABASE").required().asString(),
  DB_PASSWORD: get("PASSWORD_DATABASE").required().asString(),
  DB_DATABASE: get("DATABASE").required().asString(),
  DB_PORT: get("PORT_DATABASE").required().asPortNumber(),
  JWT_SEED: get("JWT_SEED").required().asString(),
  JWT_EXPIRE_IN:get("JWT_EXPIRE_IN").required().asString(),

  // 👇 Agrega estas líneas
  AWS_ACCESS_KEY_ID: get("AWS_ACCESS_KEY_ID").required().asString(),
  AWS_SECRET_ACCESS_KEY: get("AWS_SECRET_ACCESS_KEY").required().asString(),
  AWS_REGION: get("AWS_REGION").required().asString(),
  AWS_BUCKET_NAME: get("AWS_BUCKET_NAME").required().asString(),

};
