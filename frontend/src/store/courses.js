import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    allCourses: []
}

const courseSlice = createSlice({

    name: "course",
    initialState,

    reducers: {

        setAllCourses(state, actions) {

            state.allCourses = actions.payload
        }
    }
})

export const { setAllCourses } = courseSlice.actions

export default courseSlice.reducer
