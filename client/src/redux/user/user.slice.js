import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
    }
})

export const { signInSuccess, signOutUserSuccess, updateUserSuccess } = userSlice.actions;
export default userSlice.reducer;