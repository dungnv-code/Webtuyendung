import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserSingle } from "../../api/user";

export const getCurrent = createAsyncThunk(
    "app/getCurrent",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getUserSingle();
            if (response?.success == "false") {
                return rejectWithValue(response.rs);
            }
            return response.rs;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);