import mongoose, { Schema } from "mongoose";

const individualLectureProgressSchema = new Schema({

    lectureId:{

        type:Schema.Types.ObjectId,
        ref:"Lecture",
        required:true
    },

    status: {

        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },

})

const lectureProgressSchema = new Schema(

    {
        courseId: {

            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        
        userId:{

            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        
        indivisualLecture: [

           individualLectureProgressSchema
        ]

    }, {

    timestamps: true
})

export const LectureProgress=mongoose.model("LectureProgress",lectureProgressSchema)