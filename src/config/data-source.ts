import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,

  // Don't set this to true in production!
  // It will drop all your data every time you run the app
  // and it will create the tables again
  // and it will create the tables again
  // and it will create the tables again
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
