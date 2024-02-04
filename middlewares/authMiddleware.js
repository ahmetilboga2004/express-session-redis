import User from "../models/User.js";

export const existUsername = async (req, res, next) => {
  try {
    const username = req.body.username;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      return res.status(400).json({
        error: "Bu kullanıcı zaten kayıtlı!",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export const isLoggenIn = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export const roleControl = (role) => {
  return async (req, res, next) => {
    try {
      if (req.session && req.session.user.role === role) {
        next();
      }
      return res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status("500").json({
        error: "Server Error",
      });
    }
  };
};
