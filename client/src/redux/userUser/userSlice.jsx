import { createSlice } from '@reduxjs/toolkit';
import * as action from "./asyncActionUser";

export const UserSlice = createSlice({
    name: 'user',
    initialState: {
        isLogIn: false,
        current: null,
        token: null,
        isLoading: false,
    },

    reducers: {
        LogIn: (state, action) => {
            state.isLogIn = true;
            state.token = action.payload.accessToken;
            state.current = action.payload.user || null;
        },
        LogOut: (state) => {
            state.isLogIn = false;
            state.token = null;
            state.current = null;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(action.getCurrent.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(action.getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;  // payload = user
            state.isLogIn = true;
        });

        builder.addCase(action.getCurrent.rejected, (state, action) => {
            state.isLoading = false;

            // ⭐ Chỉ logout nếu server trả lỗi 401
            if (action.error?.message === "401" || action.payload?.status === 401) {
                state.isLogIn = false;
                state.token = null;
                state.current = null;
            }
        });
    }
});

export const { LogIn, LogOut } = UserSlice.actions;
export default UserSlice.reducer;