import knex from "knex";
import databaseConfig from "../config/database.config";

const db = knex(databaseConfig);

export default db;
