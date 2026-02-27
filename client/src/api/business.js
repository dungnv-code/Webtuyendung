import axios from "../ultils/axios"

const creatBusiness = async (data) => {
    return axios.post("/business/create", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};


const updateBusiness = async (data) => {
    return axios.put(`/business/update`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

const getDetailByBusiness = async () => {
    return axios.get(`/business/getDetailbyNTD`);
};

const getStaffs = (params) => {
    return axios.get(`/business/getStaffs`, { params })
}

export {
    creatBusiness,
    updateBusiness,
    getDetailByBusiness,
    getStaffs,
}