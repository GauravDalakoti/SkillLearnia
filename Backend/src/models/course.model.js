import mongoose, { Schema } from "mongoose"

const individualLectureSchema = new Schema({

    lecture: {
        type: String, // URL or path to the uploaded video
        required: true,
    },

    title: {
        type: String,
        required: true, // Required title for each lecture
    },

})

const courseSchema = new Schema({

    courseTitle: {

        type: String,
        required: true
    },

    Category: {

        type: String,
        required: true
    },

    Pricing: {

        type: Number,
        required: true
    },

    Level: {

        type: String,
        required: true
    },

    Primary_Language: {

        type: String,
        required: true
    },

    Subtitle: {

        type: String,
        required: true
    },

    Description: {

        type: String,
        required: true
    },

    Objective: {

        type: String,
        required: true
    },

    Welcome_Message: {

        type: String,
        required: true
    },

    courseImage: {

        type: String,
        required: true
    },

    instructorId: {

        type: Schema.Types.ObjectId,
        res: "User"
    },

    Lectures: [

        individualLectureSchema
    ],

    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

}, { timestamps: true })

export const Course = mongoose.model("Course", courseSchema)