const useExperience = require("../repository/Experience.js");

const createExperience = async (data) => {
    const existExperience = await useExperience.findByOne({ slug: data.slug });
    if (existExperience) {
        throw new Error("Nhóm kinh nghiệm với slug này đã tồn tại");
    }
    const Experience = await useExperience.create(data);
    return {
        success: true,
        data: Experience,
    };
}

const updateExperience = async (ide, data) => {
    const existExperience = await useExperience.findByOne({ _id: ide });
    if (!existExperience) {
        throw new Error("Không tìm thấy nhóm kinh nghiệm");
    }
    const updatedExperience = await useExperience.updatebyOne({ _id: ide }, data);
    return {
        success: true,
        data: updatedExperience,
    };
}

const getAllExperience = async () => {
    const Experience = await useExperience.findAll({});
    return {
        success: true,
        data: Experience,
    };
}

const deleteExperience = async (ide) => {
    const existExperience = await useExperience.findByOne({ _id: ide });
    if (!existExperience) {
        throw new Error("Không tìm thấy nhóm kinh nghiệm để xóa");
    }
    await useExperience.deletebyOne({ _id: ide });
    return {
        success: true,
        mes: "Xóa nhóm kinh nghiệm thành công",
    };
}

module.exports = {
    createExperience,
    updateExperience,
    getAllExperience,
    deleteExperience,
};