import User from "./User.js";
import Session from "./Session.js";

User.hasMany(Session);
Session.belongsTo(User);
