const useLevel = require("../repository/Level");

const createLevel = async (data) => {
    const existlevel = await useLevel.findByOne({ nameLevel: data.nameLevel });
    if (existlevel) {
        throw new Error("Cấp bậc đã tồn tại");
    }
    const level = await useLevel.create(data);
    return {
        success: true,
        data: level,
    };
}

const updateLevel = async (idl, data) => {
    const islevel = await useLevel.findByOne({ nameLevel: data.nameLevel });
    if (islevel) {
        throw new Error("Cấp bậc đã tồn tại");
    }
    const updatedlevel = await useLevel.updatebyOne({ _id: idl }, { ...data });
    return {
        success: true,
        data: updatedlevel,
    };
}

const getAllLevel = async () => {
    const level = await useLevel.findAll({});
    return {
        success: true,
        data: level,
    };
}

const deleteLevel = async (idl) => {
    const existJob = await useLevel.findByOne({ _id: idl });
    if (!existJob) {
        throw new Error("Không tìm thấy cấp bậc để xóa");
    }
    await useLevel.deletebyOne({ _id: idl });
    return {
        success: true,
        mes: "Xóa cấp bậc thành công",
    };
}

module.exports = {
    createLevel,
    updateLevel,
    getAllLevel,
    deleteLevel,
}
