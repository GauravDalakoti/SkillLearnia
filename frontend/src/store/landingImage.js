import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    LandingImage: null
}

const landingImageSlice = createSlice({

    name: "landingImage",
    initialState,

    reducers: {

        setLandingImage(state, actions) {

            state.LandingImage = actions.payload
        }
    }
})

export const { setLandingImage } = landingImageSlice.actions

export default landingImageSlice.reducer