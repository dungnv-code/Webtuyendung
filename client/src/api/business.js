import axios from "../ultils/axios"

const creatBusiness = async (data) => {
    return await axios.post("/business/create", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};


const updateBusiness = async (data) => {
    return await axios.put(`/business/update`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

const getDetailByBusiness = async () => {
    return await axios.get(`/business/getDetailbyNTD`);
};

const getStaffs = async (params) => {
    return await axios.get(`/business/getStaffs`, { params })
}

const deleteUser = async (id) => {
    return await axios.delete(`/user/deletebyadmin/${id}`)
}

const createStaffBusiness = async (data) => {
    return await axios.post("/user/createStaff", data)
}

const getInvoidBusiness = async (params) => {
    return await axios.get(`/business/getInvoids`, { params })
}

const createInvoidBusiness = async (data) => {
    return await axios.post("/invoid/create", data)
}

const createPostJobdBusiness = async (data) => {
    return await axios.post("/postjobs/create", data)
}

const getPostJobBusiness = async (params) => {
    return await axios.get("/business/getPostJobs", { params })
}

const getPostJobUserBusiness = async (idb, params) => {
    return await axios.get(`/business/getPostJobsUser/${idb}`, { params })
}

const changeStatusPausePostJobBusiness = async (id) => {
    return await axios.put(`/postjobs/changeStatusPause/${id}`,)
}

const getDetailPost = async (id) => {
    return await axios.get(`/postjobs/getDetail/${id}`)
}

const updatePostJob = async (id, data) => {
    return await axios.put(`/postjobs/update/${id}`, data)
}

const detailPostJobCV = async (id, params) => {
    return await axios.get(`/postjobs/getCVPostJobs/${id}`, { params })
}

export {
    creatBusiness,
    updateBusiness,
    getDetailByBusiness,
    getStaffs,
    deleteUser,
    createStaffBusiness,
    getInvoidBusiness,
    createInvoidBusiness,
    createPostJobdBusiness,
    getPostJobBusiness,
    getPostJobUserBusiness,
    changeStatusPausePostJobBusiness,
    getDetailPost,
    updatePostJob,
    detailPostJobCV,
}