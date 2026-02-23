import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./userJob/userJob";
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
        "app": jobReducer,
        "user": persistReducer(UserConfig, userReducer),
    }
})

export const perStore = persistStore(store);