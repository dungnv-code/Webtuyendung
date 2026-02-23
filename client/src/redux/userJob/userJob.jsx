import { createSlice } from '@reduxjs/toolkit';
import * as action from "./asyncActionJob";

export const JobSlice = createSlice({
    name: 'user',
    initialState: {
        isLoading: false,
        skill: [],
    },

    extraReducers: (builder) => {
        builder.addCase(action.getSkill.pending, (state) => {
            state.isLoading = true;
            state.skill = [];
        });
        builder.addCase(action.getSkill.fulfilled, (state, action) => {
            state.skill = action.payload.data;
            state.isLoading = false;
        }
        );
        builder.addCase(action.getSkill.rejected, (state) => {
            state.skill = [];
            state.isLoading = false;
        });
    }
});

export const { LogIn, LogOut } = JobSlice.actions;
export default JobSlice.reducer;