import axios from "../ultils/axios"

const login = (data) => {
    return axios.post("/user/Login", data, { withCredentials: true });
}

const logout = () => {
    return axios.post("/user/Logout", {}, { withCredentials: true });
}

const register = (data) => {
    return axios.post("/user/Register", data);
}

const finalRegister = (token) => {
    return axios.post("/user/finalRegister", { token });
}

const forgotPassword = (email) => {
    return axios.post("/user/forgotPassword", { email });
}

const resetPassword = (data) => {
    console.log("Data sent to API:", data); // Debug log to check the data being sent
    return axios.post("/user/resetPassword", data);
}

const getUserSingle = () => {
    return axios.get("/user/getSingle");
}


export {
    login,
    logout,
    register,
    finalRegister,
    forgotPassword,
    resetPassword,
    getUserSingle,
}
