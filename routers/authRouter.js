import express from "express";
const router = express.Router();

import * as auth from "../controllers/authController.js";

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/logout", auth.logout);
router.get("/logout-all-devices", auth.logoutAllDevices);

export default router;
