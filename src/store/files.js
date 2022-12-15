import { createSlice } from "@reduxjs/toolkit";

export const filesSlice = createSlice({
    name: 'files',
    initialState: {
        recent: [],
        allFiles: []
    },
    reducers:{
        setFiles: (state, action) =>{
            state.allFiles = action.payload
        },
    }
});

export const { setFiles } = filesSlice.actions;

export default filesSlice.reducer;