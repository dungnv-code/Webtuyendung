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

export {
    creatBusiness,
    updateBusiness,
    getDetailByBusiness,
    getStaffs,
    deleteUser,
    createStaffBusiness,
    getInvoidBusiness,
    createInvoidBusiness,
}