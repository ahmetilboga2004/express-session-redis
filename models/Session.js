import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Session = sequelize.define("session", {
  session_key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  device_info: {
    type: DataTypes.JSON,
  },
  ip: {
    type: DataTypes.STRING(64),
  },
});

export default Session;
