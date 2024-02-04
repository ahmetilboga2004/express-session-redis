import express from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "./config/redis.js";

const app = express();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

app.use(
  session({
    secret: "SECRET_KEY",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 24, // Bir gün,
    },
    store: redisStore,
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import pageRouter from "./routers/pageRouter.js";
import authRouter from "./routers/authRouter.js";

app.use((req, res, next) => {
  res.locals.user = req.session.user || undefined;
  next();
});
app.use("/", pageRouter);
app.use("/auth", authRouter);

import "./models/realationShip.js";
import sequelize from "./config/database.js";
sequelize
  .sync({ alter: true })
  .then(() => console.log("Veritabanı bağlantısı başarılı"))
  .catch(() => console.error("Veritabanı bağlantısı başarısız oldu"));

const port = 3000;
app.listen(port, () => {
  console.log("Veritabanı bağlantısı başarılı bir şekilde gerçekleşti");
});
