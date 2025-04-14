import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";
import { RefreshToken } from "../entity/RefreshToken";
import { Tenant } from "../entity/Tenant";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,

  // Don't set this to true in production!
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.{ts,js}"],
  // entities: [User, RefreshToken, Tenant],
  migrations: ["src/migration/*.{ts,js}"],
  subscribers: [],
});
