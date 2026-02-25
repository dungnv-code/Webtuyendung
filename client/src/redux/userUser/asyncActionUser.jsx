import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserSingle } from "../../api/user";

export const getCurrent = createAsyncThunk(
    "app/getCurrent",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUserSingle();
            if (!response.success) {
                return rejectWithValue(response);
            }

            return response.data; // ⭐ Chỉ trả về user
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);