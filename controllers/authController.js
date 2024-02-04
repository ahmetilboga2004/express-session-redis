import { UAParser } from "ua-parser-js";
import sequelize from "../config/database.js";
import redisClient from "../config/redis.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import CryptoJS from "crypto-js";

export const register = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    console.log(
      "\n\n\nREQ BODY VALUES: " +
        name +
        " " +
        username +
        " " +
        password +
        " " +
        role
    );
    if ((name && username, password && role)) {
      const hashedPassword = CryptoJS.AES.encrypt(
        password,
        "SECRET_KEY"
      ).toString();
      const user = await User.create({
        name: name,
        username: username,
        password: hashedPassword,
        role: role,
      });
      if (user) {
        console.log(
          "\n\nKULLANICI BAŞARILI BİR ŞEKİLDE KAYIT EDİLDİ: " + user + "\n\n"
        );
        res.status(500).json({
          data: user,
          message: "Kullanıcı başarılı bir şekilde kayıt edildi",
        });
      } else {
        console.warn("KULLANICI KAYIT EDİLEMEDİ");
        res.status(400).json({
          error: "Kullanıcı kayıt edilirken bir sorun yaşandı",
        });
      }
    } else {
      console.warn("Lütfen tüm alanları doldurun");
      res.status(400).json({
        error: "Lütfen gerekli alanları doldurun!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const user = await User.findOne({
        where: {
          username: username,
        },
      });
      if (user) {
        console.log("\n\n\nLOGIN USER: ", user);
        const hashedPassword = CryptoJS.AES.decrypt(
          user.password,
          "SECRET_KEY"
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        console.log(
          "\n\nPASSWORD: " +
            password +
            " \n\nORİGİNAL PASSWORD: " +
            originalPassword +
            "\n\n"
        );
        if (password !== originalPassword) {
          console.log("Hatalı bir şifre girdiniz");
          return res.status(401).json({
            error: "Hatalı bir şifre girdiniz",
          });
        }

        console.log("Giriş başarılı");
        const data = {
          id: user.id,
          username: user.username,
          role: user.role,
        };
        req.session.user = data;
        console.log("\n\n\nREQ SESSİON USER: ", req.session.user);
        let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        let parser = new UAParser(req.headers["user-agent"]);
        let deviceInfo = parser.getResult();
        const session = await Session.create({
          session_key: req.session.id,
          device_info: deviceInfo,
          ip: ip,
          userId: req.session.user.id,
        });
        if (session) {
          console.log("\n\nSESSION BİLGİLERİ KAYIT EDİLDİ\n\n");
        }

        res.status(200).json({
          data: user,
          message: "Giriş başarılı",
        });
      } else {
        console.warn("\n\nBöyle bir kullanıcı bulunamadı!");
        res.status(400).json({
          error: "Böyle bir kullanıcı bulunamadı!",
        });
      }
    } else {
      console.warn("Lütfen Kullanıcı adınızı ver şifrenizi girin.");
      res.status(400).json({
        error: "Lütfen kullanıcı adınızı ve şifrenizi giriniz!",
      });
    }
  } catch (error) {
    console.warn("Server Error: " + error + "\n\n");
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const t = await sequelize.transaction();

    await Session.destroy(
      {
        where: {
          session_key: req.session.id,
        },
      },
      { transaction: t }
    );
    req.session.destroy();
    await t.commit();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    const sessions = await Session.findAll({
      where: {
        userId: req.session.user.id,
      },
    });
    const sessionKeys = sessions.map((session) => session.session_key);
    console.log("\n\n\nSESSİON KEYS: " + sessionKeys + "\n\n\n");

    await Session.destroy(
      {
        where: {
          userId: req.session.user.id,
        },
      },
      {
        transaction: t,
      }
    );
    const pipeline = redisClient.pipeline();
    for (let i = 0; i < sessionKeys.length; i++) {
      console.log("181 SESSION KEY: ", sessionKeys[i]);
      pipeline.del("session:" + sessionKeys[i]);
    }
    pipeline.exec(async (err, result) => {
      if (err) console.log(err);
      console.log(result);
      await t.commit();
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};
