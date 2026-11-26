import type { Knex } from "knex";

const getRequiredTestValue = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`Missing required test database setting: ${name}`);
  }
  return value;
};

const databaseConfig: Knex.Config =
  process.env.NODE_ENV === "test"
    ? (() => {
        if (process.env.TEST_DB_DISPOSABLE !== "1") {
          throw new Error(
            "Test database disabled: set TEST_DB_DISPOSABLE=1 only for a disposable database",
          );
        }

        const database = getRequiredTestValue("TEST_DB_NAME");
        if (!/_test$/i.test(database)) {
          throw new Error("TEST_DB_NAME must end with _test");
        }

        const port = Number(getRequiredTestValue("TEST_DB_PORT"));
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          throw new Error("TEST_DB_PORT must be a valid TCP port");
        }
        if (process.env.TEST_DB_PASSWORD === undefined) {
          throw new Error("Missing required test database setting: TEST_DB_PASSWORD");
        }

        return {
          client: "mysql2",
          connection: {
            host: getRequiredTestValue("TEST_DB_HOST"),
            port,
            user: getRequiredTestValue("TEST_DB_USER"),
            password: process.env.TEST_DB_PASSWORD,
            database,
          },
          pool: { min: 0, max: 10 },
        };
      })()
    : (() => {
        require("dotenv").config();
        return {
          client: "mysql2",
          connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          },
          pool: { min: 0, max: 10 },
        };
      })();

export default databaseConfig;
