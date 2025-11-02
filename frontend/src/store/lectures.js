import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    allLectures: []
}

const lectureSlice = createSlice({

    name: "lecture",
    initialState,

    reducers: {

        setAllLectures(state, actions) {

            state.allLectures = [...state.allLectures, ...actions.payload];
        },

        setAllApiLectures(state,actions){

             state.allLectures=actions.payload
        },

         // Update a specific lecture title
        updateLectureTitle(state, action) {
            const { index, title } = action.payload;
            if (index >= 0 && index < state.allLectures.length) {
                // Update the title of the lecture at the specified index
                state.allLectures[index].title = title;
            }
        },
    }
})

export const { setAllLectures,updateLectureTitle,setAllApiLectures } = lectureSlice.actions

export default lectureSlice.reducer