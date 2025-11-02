import mongoose, { Schema } from "mongoose";

const courseProgressSchema = new Schema(

    {
        courseId: {

            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        userId: {

            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {

            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending"
        },

    }, {

    timestamps: true
})

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)