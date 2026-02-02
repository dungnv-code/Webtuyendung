const useSkill = require("../repository/Skills");

const createSkill = async (data) => {
    const existJob = await useSkill.findByOne({ nameskill: data.nameskill });
    if (existJob) {
        throw new Error("Kĩ năng đã tồn tại");
    }
    const skill = await useSkill.create(data);
    return {
        success: true,
        data: skill,
    };
}

const updateSkill = async (ids, data) => {
    const existskill = await useSkill.findByOne({ _id: ids });
    if (!existskill) {
        throw new Error("Không tìm thấy kĩ năng");
    }
    const updatedskill = await useSkill.updatebyOne({ _id: ids }, { ...data, job: new mongoose.Types.ObjectId(data.job) });
    return {
        success: true,
        data: updatedskill,
    };
}

const getAllSkill = async () => {
    const skills = await useSkill.findAll({}).populate('job');
    return {
        success: true,
        data: skills,
    };
}

const deleteSkill = async (ids) => {
    const existJob = await useSkill.findByOne({ _id: ids });
    if (!existJob) {
        throw new Error("Không tìm thấy kĩ năng để xóa");
    }
    await useSkill.deletebyOne({ _id: ids });
    return {
        success: true,
        mes: "Xóa kĩ năng thành công",
    };
}

module.exports = {
    createSkill,
    updateSkill,
    getAllSkill,
    deleteSkill,
}