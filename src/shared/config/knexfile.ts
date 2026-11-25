import type { Knex } from "knex";
import path from "path";
import * as dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../../.env.production")
    : path.resolve(__dirname, "../../../.env");

dotenv.config({ path: envFile });

const sanitize = (value: string | undefined) =>
  value?.replace(/^['"]|['"]$/g, "") || value;

const getEnv = (key: string): string => {
  const value = sanitize(process.env[key]);

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: getEnv("DB_HOST"),
      user: getEnv("DB_USER"),
      password: getEnv("DB_PASSWORD"),
      database: getEnv("DB_NAME"),
      port: Number(process.env.DB_PORT) || 3306,
    },
    migrations: {
      directory: path.join(__dirname, "../database/migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.join(__dirname, "../database/seeds"),
      extension: "ts",
    },
  },
};

export default config;
