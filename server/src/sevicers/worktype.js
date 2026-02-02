const useWorkType = require("../repository/WorkType");

const createWorktype = async (data) => {
    const existWorktype = await useWorkType.findByOne({ workType: data.workType });
    if (existWorktype) {
        throw new Error("Hình thức công việc đã tồn tại");
    }
    const worktype = await useWorkType.createWorktype(data);
    return {
        success: true,
        data: worktype,
    };
}

const updateWorktype = async (idw, data) => {
    const existworktype = await useWorkType.findByOne({ workType: data.workType });
    if (existworktype) {
        throw new Error("Hình thức công việc đã tồn tại");
    }
    const updatedworktype = await useWorkType.updatebyOne({ _id: idw }, { ...data });
    return {
        success: true,
        data: updatedworktype,
    };
}

const getAllWorktype = async () => {
    const worktype = await useWorkType.findAll({});
    return {
        success: true,
        data: worktype,
    };
}

const deleteWorktype = async (ids) => {
    const existworkType = await useWorkType.findByOne({ _id: ids });
    if (!existworkType) {
        throw new Error("Không tìm thấy hình thức công việc để xóa");
    }
    await useWorkType.deletebyOne({ _id: ids });
    return {
        success: true,
        mes: "Xóa hình thức công việc thành công",
    };
}

module.exports = {
    createWorktype,
    updateWorktype,
    getAllWorktype,
    deleteWorktype,
}