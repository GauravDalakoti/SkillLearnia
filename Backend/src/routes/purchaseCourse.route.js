import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCheckoutSession, stripeWebhook } from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.route("/checkout/create-checkout-session").post(verifyJWT, createCheckoutSession);
router.route("/webhook").post(express.raw({type:"application/json"}), stripeWebhook); 
// router.route("/course/:courseId/detail-with-status").get(verifyJWT,getCourseDetailWithPurchaseStatus);

// router.route("/").get(isAuthenticated,getAllPurchasedCourse);

export default router;