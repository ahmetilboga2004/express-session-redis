import express from "express";
const router = express.Router();

import * as page from "../controllers/pageController.js";
import * as auth from "../middlewares/authMiddleware.js";

router.get("/", page.index);
router.get("/login", page.login);
router.get("/register", page.register);
router.get("/user", auth.isLoggenIn, auth.roleControl("user"), page.user);
router.get("/moderator", page.moderator);
router.get("/admin", page.admin);

export default router;
