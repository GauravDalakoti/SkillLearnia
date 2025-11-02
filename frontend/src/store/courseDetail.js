import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    courseDetails: { courseTitle: "", Category: "", Pricing: "", Level: "", Primary_Language: "", Subtitle: "", Description: "", Objective: "", Welcome_Message: "", }
}

const courseDetailSlice = createSlice({

    name: "courseDetail",
    initialState,

    reducers: {

        setCourseDetail(state, actions) {

            const { field, value } = actions.payload;
            state.courseDetails[field] = value;
        },

        // for setting all fields at once (from API)
        setAllCourseDetails(state, action) {
            state.courseDetails = action.payload;
        },
    }
})

export const { setCourseDetail, setAllCourseDetails } = courseDetailSlice.actions

export default courseDetailSlice.reducer