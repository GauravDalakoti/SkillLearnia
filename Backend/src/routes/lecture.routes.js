import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import { deleteLecture, uploadLectures,replacedLecture, addNewLecture, changeLectureStatus, updateLecturesTitle } from "../controllers/lecture.controller.js";

const router = Router()

router.route("/upload-lectures").post(verifyJWT, upload.array("lectures",10), uploadLectures)
router.route("/get-all-lectures").get(verifyJWT)
router.route("/delete-lecture/:id/:courseId").delete(verifyJWT,deleteLecture)
router.route("/replace-lecture/:_id/:courseId").post(verifyJWT,upload.single("replacedLecture"),replacedLecture)
router.route("/add-new-lecture/:courseId").post(verifyJWT,upload.single("newLecture"),addNewLecture)
router.route("/change-lecture-status/:id/:courseId").post(verifyJWT,changeLectureStatus)
router.route("/update-lecture-title/:courseId").post(verifyJWT,updateLecturesTitle)

export default router;