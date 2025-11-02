import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addNewCourse,updateCourse, coursePurchaseDetails, deleteCourse, getAllCourses, getCourseLandingDetails, getCurrentCourse, getInstructorCourses, getStudentEnrolledCourses, searchCourse, replaceLandingImage, updateCourseDetails, getCurrentCourseAndLectureProgress } from "../controllers/course.controller.js";

const router = Router()

router.route("/add-new-course").post(verifyJWT, upload.fields([
    { name: "courseImage", maxCount: 1 },    // Accept 1 image
    { name: "lectures", maxCount: 10 } // Accept multiple videos
]), addNewCourse)
router.route("/get-all-course").get(getAllCourses)
router.route("/get-current-course").post(getCurrentCourse)
router.route("/get-student-enrolled-courses").get(verifyJWT, getStudentEnrolledCourses)
router.route("/get-instructor-courses").get(verifyJWT, getInstructorCourses)
router.route("/delete-course").post(verifyJWT, deleteCourse)
router.route("/search-course").post(searchCourse)
router.route("/course-purchased-details").get(verifyJWT,coursePurchaseDetails)
router.route("/get-course-landing-details").post(verifyJWT,getCourseLandingDetails)
router.route("/update-course/:courseId").post(verifyJWT,upload.fields([
    { name: "courseImage", maxCount: 1 },    // Accept 1 image
    { name: "lectures", maxCount: 10 } // Accept multiple videos
]),updateCourse)
router.route("/replace-landing-image/:courseId").post(verifyJWT,upload.single("landingImage"),replaceLandingImage)
router.route("/update-course-details/:courseId").post(verifyJWT,updateCourseDetails)
router.route("/get-current-course-and-lecture-progress/:_id").get(verifyJWT,getCurrentCourseAndLectureProgress)


export default router;