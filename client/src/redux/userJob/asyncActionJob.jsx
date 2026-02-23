import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSkillapi } from "../../api/user";

export const getSkill = createAsyncThunk(
    "app/getSkill",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getSkillapi();
            if (response?.success == "false") {
                return rejectWithValue(response);
            }
            console.log("Response from API:", response);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);