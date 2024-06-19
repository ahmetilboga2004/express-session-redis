import { Sequelize } from "sequelize";
const sequelize = new Sequelize("express-session-redis", "postgres", "123456", {
    dialect: "postgres",
    host: "localhost",
});

export default sequelize;
