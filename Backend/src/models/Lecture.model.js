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

const lectureSchema = new Schema({

    Lectures: [

        individualLectureSchema
    ],

    instructorId: {

        type: Schema.Types.ObjectId,
        res: "User"
    }

}, { timestamps: true })

export const Lecture = mongoose.model("Lecture", lectureSchema)
export const IndivdualLecture=mongoose.model("IndivdualLecture",individualLectureSchema)