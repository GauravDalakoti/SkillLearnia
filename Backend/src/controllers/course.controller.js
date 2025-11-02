import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { LectureProgress } from "../models/lectureProgress.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

const addNewCourse = asyncHandler(async (req, res) => {

    const { courseTitle, Category, Pricing, Level, Primary_Language, Subtitle, Description, Objective, Welcome_Message, lectureTitles } = req.body

    if ([courseTitle, Category, Pricing, Level, Primary_Language, Subtitle, Description, Objective, Welcome_Message, lectureTitles].some((field) => field == "")) {

        throw new ApiError(400, "All Field must be required")
    }

    if (!req.files || !req.files.courseImage || req.files.courseImage.length === 0) {
        throw new ApiError(400, "Course image is required");
    }

    const uploadedCourseImage = await uploadOnCloudinary(req.files.courseImage[0].path);

    if (!uploadedCourseImage) {
        throw new ApiError(400, "Something went wrong while uploading course image to Cloudinary");
    }

    if (!req.files.lectures || req.files.lectures.length === 0) {
        throw new ApiError(400, "Lectures are required");
    }

    const uploadedLectures = await Promise.all(
        req.files.lectures.map(async (curLecture) => {
            const uploaded = await uploadOnCloudinary(curLecture.path);
            return uploaded ? uploaded.url : null;
        })
    );

    if (!uploadedLectures.length || uploadedLectures.includes(null)) {
        throw new ApiError(400, "Something went wrong while uploading lectures to Cloudinary");
    }

    const titlesArray = Array.isArray(lectureTitles) ? lectureTitles : [lectureTitles];

    const allUploadedLectures = uploadedLectures.map((lectureUrl, index) => ({
        lecture: lectureUrl,
        title: titlesArray[index] || `Lecture ${index + 1}`, // Default title if missing
    }));

    const addedCourse = await Course.create({
        courseTitle,
        Category,
        Pricing,
        Level,
        Primary_Language,
        Subtitle,
        Description,
        Objective,
        Welcome_Message,
        courseImage: uploadedCourseImage.url,
        Lectures: allUploadedLectures,
        instructorId: req.user?._id,
    });

    if (!addedCourse) {
        throw new ApiError(400, "Error while adding the new course");
    }

    return res.status(200)
        .json(new ApiResponse(200, addedCourse, "Course Added Successfully"));

})


const updateCourse = asyncHandler(async (req, res) => {

    const { courseTitle, Category, Pricing, Level, Primary_Language, Subtitle, Description, Objective, Welcome_Message, lectureTitles } = req.body

    const { courseId } = req.params
    console.log(courseId, courseTitle);


    if ([courseTitle, Category, Pricing, Level, Primary_Language, Subtitle, Description, Objective, Welcome_Message, lectureTitles].some((field) => field == "")) {

        throw new ApiError(400, "All Field must be required")
    }

    console.log(Category);


    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            courseTitle,
            Category,
            Pricing,
            Level,
            Primary_Language,
            Subtitle,
            Description,
            Objective,
            Welcome_Message,
            instructorId: req.user?._id,
        },
        { new: true }
    )

    console.log(updatedCourse);


    if (!updatedCourse) {

        throw new ApiError(400, "Error while updating the data on the database")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedCourse, "course updated successfully"))

})

const getAllCourses = asyncHandler(async (req, res) => {

    const allcoures = await Course.find({})

    if (!allcoures) {

        throw new ApiError(400, "No courses found")
    }

    return res.status(200)
        .json(new ApiResponse(200, allcoures, "all courses fetched successfully"))

})

const getCurrentCourse = asyncHandler(async (req, res) => {

    const { _id } = req.body;

    if (!_id) {

        throw new ApiError(400, "Id is required")
    }

    const course = await Course.find({ _id })

    if (!course) {

        throw new ApiError(401, "Course not found")
    }

    return res.status(200)
        .json(new ApiResponse(200, course, "Current Course Found Successfully"))

})

const editCourse = asyncHandler(async (req, res) => {

    const { courseTitle, courseDescription, courseDuration, coursePrice } = req.body

    if ([courseTitle, courseDescription, courseDuration, coursePrice].some((field) => field == "")) {

        throw new ApiError(400, "All Field must be required")
    }
})

const getStudentEnrolledCourses = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id)

    if (!user) {

        throw new ApiError(404, "User not found")
    }

    const enrolledCoursesIds = user?.enrolledCourses

    const userEnrolledCourses = await Course.find({ _id: { $in: enrolledCoursesIds } })

    if (!userEnrolledCourses) {

        throw new ApiError(404, "no enrolled course Found")
    }

    const courseProgress = await CourseProgress.find({ courseId: { $in: enrolledCoursesIds }, userId: req.user._id })

    if (!courseProgress) {

        throw new ApiError(404, "course progress not found")
    }

    const progressMap = {};
    courseProgress.forEach(progress => {
        progressMap[progress.courseId.toString()] = progress.status;
    });

    // Merge status into each course
    const coursesWithStatus = userEnrolledCourses.map(course => ({
        ...course.toObject(),
        status: progressMap[course._id.toString()] || "pending"
    }));

    return res.status(200)
        .json(new ApiResponse(200, coursesWithStatus, "user courses fetched successfully"))

})

const getInstructorCourses = asyncHandler(async (req, res) => {

    const id = req.user?._id

    const instructorallcourses = await Course.find({ instructorId: id })

    if (!instructorallcourses) {

        throw new ApiError(404, "No course found")
    }

    return res.status(200)
        .json(new ApiResponse(200, instructorallcourses, "user all course fetched successfully"))

})

const deleteCourse = asyncHandler(async (req, res) => {

    const { id } = req.body
    const deletedCourse = await Course.deleteOne({ id })

    if (!deletedCourse) {

        throw new ApiError(500, "internal server error")
    }

    return res.status(200)
        .json(new ApiResponse(200, {}, "Course Deleted Successfully"))

})

const getCourseLandingDetails = asyncHandler(async (req, res) => {

    const { courseId } = req.body;

    if (!courseId) {

        throw new ApiError(400, "Course Id Required")
    }

    const courseLandingPageDetails = await Course.findById(courseId).select("courseTitle Category Pricing Level Primary_Language Subtitle Description Objective Welcome_Message -_id")

    return res.status(200)
        .json(new ApiResponse(200, courseLandingPageDetails, "course Landing page details find succussfully"))

})

const searchCourse = asyncHandler(async (req, res) => {

    const { searchQuery } = req.body;

    if (searchQuery == "") {

        throw new ApiError(400, "Search Query Is Required")
    }

    const course = await Course.find({
        courseTitle: { $regex: searchQuery, $options: 'i' }
    });

    console.log(course);

    if (!course) {

        throw new ApiError(404, "Course not found")
    }

    return res.status(200)
        .json(new ApiResponse(200, course[0]._id, "Course Fetched Successfully"))

})

const coursePurchaseDetails = asyncHandler(async (req, res) => {

    const purchasedCourse = await CoursePurchase.find()
    console.log(purchasedCourse);

    let totalRevenue = 0;
    let totalStudents = 0;

    purchasedCourse.map((course) => (

        totalRevenue += course.amount,
        totalStudents += 1
    ))

    let arr = [];

    arr = await Promise.all(
        purchasedCourse.map(async (pc) => {
            const course = await Course.findById(pc.courseId);
            const user = await User.findById(pc.userId);

            return {
                courseTitle: course.courseTitle,
                userName: user.username,
                email: user.email,
            };
        })
    );

    return res.status(200)
        .json(new ApiResponse(200, { totalRevenue, totalStudents, arr }, "Course Purchased Details Find Successfully"))

})

const lectureProgress = asyncHandler(async (req, res) => {

    const { postion } = req.body;

    if (!postion) {

        throw new ApiError(400, "postion is required")
    }

    const id = req.user._id

    const purchasedcourse = await CoursePurchase.find({ userId: id })

    if (!lectureProgress) {

        throw new ApiError(400, "No Course Found")
    }

    const course = await Course.findById(lectureProgress.courseId)

    const size = course.Lectures.length();

    await lectureProgress

    course.
        course.lectureProgress = position
})

const replaceLandingImage = asyncHandler(async (req, res) => {

    const { courseId } = req.params
    const { oldLandingImage } = req.body

    if (!courseId && !oldLandingImage) {

        throw new ApiError(400, "course Id and old landing image is required")
    }

    const landingImage = req.file;

    if (!landingImage) {

        throw new ApiError(400, "landing image is required")
    }

    const uploadedLandingImage = await uploadOnCloudinary(landingImage.path)

    if (!uploadedLandingImage) {

        throw new ApiError(400, "Error while uploading the landing image on cloundinary")
    }

    const updatedLandingImage = await Course.findByIdAndUpdate(

        courseId,
        {
            courseImage: uploadedLandingImage.url
        },
        {
            new: true
        }
    ).select("courseImage")

    const deletedLandingImage = await deleteFromCloudinary(oldLandingImage)

    return res.status(200)
        .json(new ApiResponse(200, updatedLandingImage, "course Landing Image Updated Succussfully"))

})

const updateCourseDetails = asyncHandler(async (req, res) => {

    const { courseTitle, Category, Pricing, Level, Primary_Language, Subtitle, Description, Objective, Welcome_Message, lectureTitles } = req.body

    const { courseId } = req.params

    if ([courseTitle, Category, Pricing, Level, Primary_Language, Subtitle, Description, Objective, Welcome_Message, lectureTitles].some((field) => field == "")) {

        throw new ApiError(400, "All Field must be required")
    }

    if (!courseId) {

        throw new ApiError(400, "course Id is required")
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            courseTitle,
            Category,
            Pricing,
            Level,
            Primary_Language,
            Subtitle,
            Description,
            Objective,
            Welcome_Message,
            instructorId: req.user?._id,
        },
        { new: true }
    )

    if (!updatedCourse) {

        throw new ApiError(400, "Error while updating the data on the database")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedCourse, "Course Details Updated Successfully"))

})

const getCurrentCourseAndLectureProgress = asyncHandler(async (req, res) => {

    const { _id } = req.params;

    if (!_id) {

        throw new ApiError(400, "Id is required")
    }

    const course = await Course.find({ _id })

    if (!course) {

        throw new ApiError(401, "Course not found")
    }

    const lectureProgress = await LectureProgress.find({ courseId: _id, userId: req.user?._id })
    console.log(lectureProgress)

    if (!lectureProgress) {

        throw new ApiError(404, "lecture progress not found")
    }

    const lectureObject = lectureProgress[0]?.indivisualLecture.reduce((obj, lecture) => {
        if (lecture.status === 'completed') {
            obj[lecture.lectureId] = true;
        }
        return obj;
    }, {});

    const courseProgress = await CourseProgress.find({ courseId: _id, userId: req.user?._id })

    const courseStatus = courseProgress[0]?.status

    return res.status(200)
        .json(new ApiResponse(200, { course, lectureObject, courseStatus }, "Current Course and lecture progress Find Successfully"))


})

export { addNewCourse, updateCourse, getAllCourses, getCurrentCourse, getStudentEnrolledCourses, getInstructorCourses, deleteCourse, getCourseLandingDetails, searchCourse, lectureProgress, coursePurchaseDetails, replaceLandingImage, updateCourseDetails, getCurrentCourseAndLectureProgress }
