import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userUser/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist"
const CommonConfig = {
    key: "tuyendung/user",
    storage
}

const UserConfig = {
    ...CommonConfig,
    whitelist: ["isLogIn", "token"],
}

export const store = configureStore({
    reducer: {
        "user": persistReducer(UserConfig, userReducer),
    }
})

export const perStore = persistStore(store);