import axios from "../ultils/axios"
// jobs
const getAllJob = (params) => {
    return axios.get("/jobs/getAll", { params });
}

const createJob = (data) => {
    return axios.post("/jobs/create", data)
}

const updateJob = (id, data) => {
    return axios.put(`/jobs/update/${id}`, data)
}

const deleteJob = (id) => {
    return axios.delete(`/jobs/delete/${id}`)
}

// level

const getAllLevel = (params) => {
    return axios.get(`/level/getAll`, { params })
}

const createLevel = (data) => {
    return axios.post("/level/create", data)
}

const updateLevel = (id, data) => {
    return axios.put(`/level/update/${id}`, data)
}

const deleteLevel = (id) => {
    return axios.delete(`/level/delete/${id}`)
}
// style work

const getAllStyleJob = (params) => {
    return axios.get(`/worktype/getAll`, { params })
}

const createStyleJob = (data) => {
    return axios.post("/worktype/create", data)
}

const updateStyleJob = (id, data) => {
    return axios.put(`/worktype/update/${id}`, data)
}

const deleteStyleJob = (id) => {
    return axios.delete(`/worktype/delete/${id}`)
}

// exp

const getAllExp = (params) => {
    return axios.get(`/experience/getAll`, { params })
}

const createExp = (data) => {
    return axios.post("/experience/create", data)
}

const updateExp = (id, data) => {
    return axios.put(`/experience/update/${id}`, data)
}

const deleteExp = (id) => {
    return axios.delete(`/experience/delete/${id}`)
}

// user 
const getAllUser = (params) => {
    return axios.get(`/user/getAll`, { params })
}

const deleteUser = (id) => {
    return axios.delete(`/user/delete/${id}`)
}

const changeStatusUser = (id) => {
    return axios.put(`/user/changeStatus/${id}`)
}

// skill
const getAllSkill = (params) => {
    return axios.get(`/skill/getAll`, { params })
}

const createSkill = (data) => {
    return axios.post("/skill/create", data)
}

const updateSkill = (id, data) => {
    return axios.put(`/skill/update/${id}`, data)
}

const deleteSkill = (id) => {
    return axios.delete(`/skill/delete/${id}`)
}

// salaryrange

const getAllSalaryrange = (params) => {
    return axios.get(`/salaryrange/getAll`, { params })
}

const createSalaryrange = (data) => {
    return axios.post("/salaryrange/create", data)
}

const updateSalaryrange = (id, data) => {
    return axios.put(`/salaryrange/update/${id}`, data)
}

const deleteSalaryrange = (id) => {
    return axios.delete(`/salaryrange/delete/${id}`)
}

// PacketPost

const getAllPacketPost = (params) => {
    return axios.get(`/postpackage/getAll`, { params })
}

const createPacketPost = (data) => {
    return axios.post("/postpackage/create", data)
}

const updatePacketPost = (id, data) => {
    return axios.put(`/postpackage/update/${id}`, data)
}

const deletePacketPost = (id) => {
    return axios.delete(`/postpackage/delete/${id}`)
}

const changeStatusPacketPost = (id) => {
    return axios.put(`/postpackage/changeStatus/${id}`)
}

// business

const getAllBusiness = (params) => {
    return axios.get(`/business/getAll`, { params })
}

const getDetailBusiness = (id) => {
    return axios.get(`/business/getDetail/${id}`)
}

const changeStatusBusiness = (id) => {
    return axios.put(`/business/changeStatus/${id}`)
}

// postjobs

const getAllPostjobs = (params) => {
    return axios.get(`/postjobs/getAll`, { params })
}

const getDetailPostjobs = (id) => {
    return axios.get(`/postjobs/getDetail/${id}`)
}

const changeStatusPostjobs = (id) => {
    return axios.put(`/postjobs/changeStatus/${id}`)
}


export {
    // Job
    getAllJob,
    createJob,
    updateJob,
    deleteJob,
    // level
    getAllLevel,
    createLevel,
    updateLevel,
    deleteLevel,
    // stylejob
    getAllStyleJob,
    createStyleJob,
    updateStyleJob,
    deleteStyleJob,
    // exp
    getAllExp,
    createExp,
    updateExp,
    deleteExp,
    // user
    getAllUser,
    deleteUser,
    changeStatusUser,
    // skill
    getAllSkill,
    updateSkill,
    createSkill,
    deleteSkill,
    // salaryrange
    getAllSalaryrange,
    createSalaryrange,
    updateSalaryrange,
    deleteSalaryrange,
    // postpackage
    getAllPacketPost,
    createPacketPost,
    updatePacketPost,
    deletePacketPost,
    changeStatusPacketPost,
    // business
    getAllBusiness,
    getDetailBusiness,
    changeStatusBusiness,
    // postjobs
    getAllPostjobs,
    changeStatusPostjobs,
    getDetailPostjobs,
}