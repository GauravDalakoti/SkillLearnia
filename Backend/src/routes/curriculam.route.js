import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadCurriculamBulkVideos, uploadCurriculamVideo } from "../controllers/curriculam.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/upload-curriculam-video").post(verifyJWT, upload.single("lecture"), uploadCurriculamVideo)
router.route("/upload-curriculam-bulk-videos").post(verifyJWT, upload.array("lectures"), uploadCurriculamBulkVideos)

export default router;