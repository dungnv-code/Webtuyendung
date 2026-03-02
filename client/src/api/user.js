import axios from "../ultils/axios"

const login = (data) => {
    return axios.post("/user/Login", data, { withCredentials: true });
}

const logout = () => {
    return axios.post("/user/Logout", {}, { withCredentials: true });
}

const refreshToken = () => {
    return axios.post("/user/refreshToken", {}, { withCredentials: true });
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

const resetPassword = async (data) => {
    return await axios.post("/user/resetPassword", data);
}

const getUserSingle = async () => {
    return await axios.get("/user/getSingle");
}

const updateUser = async (id, data) => {
    return await axios.put(`/user/update/${id}`, data);
}

const changePasswordUser = async (data) => {
    return await axios.post(`/user/changePassword`, data);
}

export {
    login,
    refreshToken,
    logout,
    register,
    finalRegister,
    forgotPassword,
    resetPassword,
    getUserSingle,
    updateUser,
    changePasswordUser,
}
