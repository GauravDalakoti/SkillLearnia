import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (userId) => {

    try {

        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {

        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }

}

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, role } = req.body

    if ([username, email, password, role].some((field) => field === "")) {

        throw new ApiError(400, "All Field must be required")
    }

    const isAlreadyExisted = await User.findOne({

        $or: [{ username }, { email }]
    })

    if (isAlreadyExisted) {

        throw new ApiError(400, "User with email or username are already existed")
    }

    const user = await User.create({

        username,
        email,
        password,
        role
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {

        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(200)
        .json(new ApiResponse(200, createdUser, "User registered Successfully"))

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password, role } = req.body;

    console.log(role);


    if ([email, password, role].some((field) => field === "")) {

        throw new ApiError(400, "All field must be required")
    }

    const user = await User.findOne({ email: email })

    if (!user) {

        throw new ApiError(400, "user not found")
    }

    const userWithRole = await User.find({ email: email, role: role })

    if (userWithRole.length === 0) {

        throw new ApiError(400, "user not found with this role")
      
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {

        throw new ApiError(400, "invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {

        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { loggedInUser, accessToken, refreshToken }, "User Login Successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(

        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {

        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, req.user?.role, "User logout Successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200)
        .json(new ApiResponse(200, req.user, "Current User Fetched Successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {

        throw new ApiError(401, "unauthorized request")
    }

    try {

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {

            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {

            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {

            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                ),
            )

    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken }