import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture, IndivdualLecture } from "../models/Lecture.model.js";
import { LectureProgress } from "../models/lectureProgress.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";

const uploadLectures = asyncHandler(async (req, res) => {

    const { lectureTitles } = req.body

    if (!lectureTitles) {

        throw new ApiError(400, "Lecture titles not found")
    }

    const lectures = req.files;

    if (!lectures) {

        throw new ApiError(400, "files not found")
    }

    const allLecutures = lectures.map(async (curLecture) => {
        const Lecture = await uploadOnCloudinary(curLecture.path)
        return Lecture
    })

    const uploadedLectures = await Promise.all(allLecutures)

    if (!uploadedLectures) {

        throw new ApiError(400, "Something went wrong while uploading on cloudinary")
    }

    const lectureUrl = uploadedLectures.map((curlecture) => {

        const result = curlecture.url
        return result
    })

    const AllLecutureUrl = await Promise.all(lectureUrl)

    const titlesArray = Array.isArray(lectureTitles) ? lectureTitles : [lectureTitles];

    // Combine file paths with titles for response
    const allUploadedLectures = AllLecutureUrl.map((file, index) => ({
        lecture: file, // File path on the server
        title: titlesArray[index], // Title corresponding to the file
    }));

    const uploadedlectures = await Lecture.create({

        Lectures: allUploadedLectures,
        instructorId: req.user?._id,
    })

    return res.status(200)
        .json(new ApiResponse(200, uploadedlectures, "All Lecuture Uploaded Successfully"))

})

const getAllLectures = asyncHandler(async (req, res) => {

    const { _id } = await req.body
    const allLectures = await Lecture.findById(_id)

    if (!allLectures) {

        throw new ApiError(400, "lectures not found")
    }

})

const deleteLecture = asyncHandler(async (req, res) => {

    const { id, courseId } = req.params;

    if (!id && !courseId) {

        throw new ApiError(400, "id and lecutureId is required");
    }

    const course = await Course.findById(courseId); // or courseId if your model is Course

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const foundSub = course.Lectures.find(l => l._id.toString() === id);
    const deletedVideo = await deleteFromCloudinary(foundSub.lecture)

    const updatedLecture = await Course.findByIdAndUpdate(
        courseId,
        { $pull: { Lectures: { _id: id } } }, // removes the subdocument
        { new: true } // returns the updated document
    );

    if (!updatedLecture) {

        throw new ApiError(400, "Error while deleting the lecture from the database")
    }

    return res.status(200)
        .json(new ApiResponse(200, updatedLecture, "Lecture deleted successfully"))

})

const replacedLecture = asyncHandler(async (req, res) => {

    const { replacedLectureTitle, oldLectureUrl } = req.body;
    const { _id, courseId } = req.params;

    if (!_id && !courseId) {

        throw new ApiError(400, "id and courseId is required");
    }

    if (!replacedLectureTitle) {

        throw new ApiError(400, "title is required")
    }

    const replacedLecture = req.file;

    if (!replacedLecture) {

        throw new ApiError(400, "lecture is required")
    }

    const uploadedLecture = await uploadOnCloudinary(replacedLecture.path)

    if (!uploadedLecture) {

        throw new ApiError(400, "Error while uploading on cloudinary")
    }

    const updateFields = {};
    if (uploadedLecture) updateFields["Lectures.$.lecture"] = uploadedLecture.url;
    if (replacedLectureTitle) updateFields["Lectures.$.title"] = replacedLectureTitle;

    const updatedCourse = await Course.findOneAndUpdate(
        { _id: courseId, "Lectures._id": _id },
        { $set: updateFields },
        { new: true }
    );

    if (!updatedCourse) {
        throw new ApiError(400, "Failed to update lecture URL");
    }

    const deletedoldLecture = await deleteFromCloudinary(oldLectureUrl)

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCourse, "Lecture updated successfully"));

})

const addNewLecture = asyncHandler(async (req, res) => {

    const { newLectureTitle } = req.body;
    const { courseId } = req.params;

    if (!courseId) {

        throw new ApiError(400, "courseId is required");
    }

    if (!newLectureTitle) {

        throw new ApiError(400, "title is required")
    }

    const newLecture = req.file;

    if (!newLecture) {

        throw new ApiError(400, "lecture is required")
    }

    const uploadedLecture = await uploadOnCloudinary(newLecture.path)

    if (!uploadedLecture) {

        throw new ApiError(400, "Error while uploading on cloudinary")
    }

    const lectureData = {
        lecture: uploadedLecture.url,
        title: newLectureTitle,
    };

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $push: { Lectures: lectureData } }, // adds new lecture
        { new: true }
    );

    if (!updatedCourse) {
        throw new ApiError(400, "Failed to add new lecture");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCourse, "New Lecture Added successfully"));

})

const changeLectureStatus = asyncHandler(async (req, res) => {

    const { id, courseId } = req.params;

    if (!id && !courseId) {

        throw new ApiError(400, "id and courseId is required")
    }

    const course = await Course.findById(courseId)

    if (!course) {

        throw new ApiError(404, "Course not found")
    }

    const totalLecture = course.Lectures.length

    const filter = {
        courseId: courseId,
        userId: req.user._id,
    };

    const updateFilter = {
        ...filter, // Use the same base filter
        'indivisualLecture.lectureId': id, // Add condition to match the array element
    };
    const update = {
        $set: {
            'indivisualLecture.$.status': "completed",
        },
    };
    const options = {
        new: true,
    };

    // Attempt to update an existing lecture's status.
    const updatedDocument = await LectureProgress.findOneAndUpdate(updateFilter, update, options);

    if (updatedDocument) {
        console.log('Successfully updated existing lecture status.');
        return updatedDocument;
    } else {
        // If the lecture wasn't found (no update happened),
        // either insert a new document or push a new lecture.
        const addLectureFilter = filter; // Use the base filter
        const addLectureUpdate = {
            $addToSet: {
                indivisualLecture: {
                    lectureId: id,
                    status: "completed",
                },
            },
        };
        const addLectureOptions = {
            upsert: true, // Create a new document if one doesn't exist
            new: true,
        };

        const result = await LectureProgress.findOneAndUpdate(addLectureFilter, addLectureUpdate, addLectureOptions);
    }

    const courseLectureProgress = await LectureProgress.find({ userId: req.user?._id, courseId: courseId })

    const courseLectureProgressLength = courseLectureProgress[0].indivisualLecture.length
    console.log(courseLectureProgressLength);

    if (totalLecture === courseLectureProgressLength) {

        const courseProgress = await CourseProgress.find({ courseId: courseId, userId: req.user?._id });

        if (courseProgress.length === 0) {
            console.log("No course progress found, creating a new document.");

            const createdCourseProgress = await CourseProgress.create({
                userId: req.user?._id,
                courseId: courseId,
                status: "completed"
            });
            console.log("Created course progress:", createdCourseProgress);
        } else {
            // A document was found, proceed with updates or other logic
            console.log("Existing course progress found:", courseProgress);
        }

        // const filter = {
        //     userId: req.user?._id,
        //     courseId: courseId,
        // };

        // const update = {
        //     $set: {
        //         status: "completed"
        //     },
        // };

        // const options = {
        //     new: true,
        //     upsert: false,
        // };

        // const updatedCourseProgess = await CourseProgress.findByIdAndUpdate(filter, update, options)
        // }

        // else {

        //     const createdCourseProgress = await CourseProgress.create({
        //         userId: req.user?._id,
        //         courseId: courseId,
        //         status: "completed"
        //     })
        // }

    }

    return res.status(200)
        .json(new ApiResponse(200, {}, "Lecture Status Updated Succussfully"))

})

const updateLecturesTitle = asyncHandler(async (req, res) => {

    const { allLectures } = req.body;

    if (!allLectures) {

        throw new ApiError(400, "Lectures not found")
    }

    const { courseId } = req.params;

    if (!courseId) {

        throw new ApiError(400, "Course Id Is Required")
    }

    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, "Course not found");

    // Loop through incoming lectures
    allLectures.forEach((updatedLecture) => {
        const lecture = course.Lectures.id(updatedLecture._id);
        if (lecture) {
            if (updatedLecture.title) lecture.title = updatedLecture.title;
        }
    });

    // Save updated course
    await course.save();

    return res
        .status(200)
        .json(new ApiResponse(200, course, "Lectures Title updated successfully"));

})

export { uploadLectures, deleteLecture, replacedLecture, addNewLecture, changeLectureStatus, updateLecturesTitle }