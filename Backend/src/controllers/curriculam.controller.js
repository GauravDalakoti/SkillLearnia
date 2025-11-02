import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const uploadCurriculamVideo = asyncHandler(async (req, res) => {

    const lecture = req.file;

    if (!lecture) {

        throw new ApiError(400, "file not found")
    }

    const uploadedfile = await uploadOnCloudinary(lecture.path)

    if (!uploadedfile) {

        throw new ApiError(400, "Something went wrong while uploading on cloudinary")
    }

    return res.status(200)
        .json(new ApiResponse(200, [uploadedfile.url], "lecture uploaded Successfully"))

})

const uploadCurriculamBulkVideos = asyncHandler(async (req, res) => {

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

    return res.status(200)
        .json(new ApiResponse(200, AllLecutureUrl, "All Lecuture Uploaded Successfully"))

})

export { uploadCurriculamVideo, uploadCurriculamBulkVideos }