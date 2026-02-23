import axios from "../ultils/axios"

const login = (data) => {
    return axios.post("/user/Login", data);
}

const register = (data) => {
    return axios.post("/user/Register", data);
}

const finalRegister = (token) => {
    return axios.post("/user/finalRegister", { token });
}

const getUserSingle = () => {
    return axios.get("/user/getSingle");
}

const getSkillapi = () => {
    return axios.get("/skill/getAll");
}


export {
    login,
    register,
    finalRegister,
    getUserSingle,
    getSkillapi,
}
