import axios from "../ultils/axios"

const creatBusiness = async (data) => {
    return axios.post("/business/create", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export { creatBusiness }