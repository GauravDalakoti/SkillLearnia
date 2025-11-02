import { configureStore } from "@reduxjs/toolkit";
import authentication from "./authentication.js"
import courseSlice from "./courses.js"
import lectureSlice from "./lectures.js"
import courseDetailSlice from "./courseDetail.js"
import landingImageSlice from "./landingImage.js"

const store = configureStore({

    reducer: {

        auth: authentication,
        course: courseSlice,
        lecture: lectureSlice,
        courseDetail: courseDetailSlice,
        landingImage: landingImageSlice
    }
})

export default store