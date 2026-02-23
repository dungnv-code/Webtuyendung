import axios from "../ultils/axios"

const getUserSingle = () => {
    return axios.get("/user/getSingle");
}

const getSkillapi = () => {
    return axios.get("/skill/getAll");
}


export {
    getUserSingle,
    getSkillapi,
}
