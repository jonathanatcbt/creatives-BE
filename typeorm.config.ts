import {
  User,
  Comments,
  Brand,
  Project,
  ProjectStatus,
  OtherStatus,
  EditingStatus,
  ClientEditingStatus,
  ClientOtherStatus,
  EditorNotification,
  ProjectOrdering,
  Company,
} from "./src/entities/index";
import { config } from "dotenv";
config();
module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  entities: [
    Project,
    User,
    Comments,
    ProjectStatus,
    Brand,
    OtherStatus,
    EditingStatus,
    ClientEditingStatus,
    ClientOtherStatus,
    EditorNotification,
    ProjectOrdering,

    Company,
  ],
  synchronize: true,
};
