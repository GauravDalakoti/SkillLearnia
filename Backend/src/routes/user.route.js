import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router() 

router.route("/register-user").post(registerUser)
router.route("/login-user").post(loginUser)

router.route("/logout-user").get(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)

export default router;