import { Sequelize } from "sequelize";

const sequelize = new Sequelize("session-app", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
});

export default sequelize;
