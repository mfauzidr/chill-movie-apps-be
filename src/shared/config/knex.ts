import knex from "knex";
import databaseConfig from "./database.config";

const db = knex(databaseConfig);

export default db;
