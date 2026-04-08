import axios from "../ultils/axios"

const login = (data) => {
    console.log("Login data:", data);
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

const createWishListJob = async (id) => {
    return await axios.post(`/user/createWishListJob/${id}`);
}

const createWishListBusiness = async (id) => {
    return await axios.post(`/user/createWishListBusiness/${id}`);
}

const checkWishlistJob = async (id) => {
    return await axios.get(`/user/checkWishlistJob/${id}`);
}

const checkWishlistBusiness = async (id) => {
    return await axios.get(`/user/checkWishlistBusiness/${id}`);
}

const wishlistjob = async () => {
    return await axios.get(`/user/wishlistjob`);
}

const wishlistbusiness = async () => {
    return await axios.get(`/user/wishlistbusiness`);
}

const listCVupload = async () => {
    return await axios.get(`/user/listCVupload`);
}

const chatboxUser = async (data) => {
    return await axios.post(`/user/chatbox`, data);
}

const getNotifications = async () => {
    return await axios.get(`/user/getNotifications`);
}

const markNotificationAsRead = async () => {
    return await axios.post(`/user/markNotificationAsRead`);
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
    createWishListBusiness,
    createWishListJob,
    checkWishlistJob,
    checkWishlistBusiness,
    wishlistjob,
    wishlistbusiness,
    listCVupload,
    chatboxUser,
    getNotifications,
    markNotificationAsRead,
}
