const useSalaryRange = require("../repository/SalaryRange");

const createSalaryRange = async (data) => {
    const existSalaryRange = await useSalaryRange.findByOne({ salaryRange: data.salaryRange });
    if (existSalaryRange) {
        throw new Error("Khoảng lương đã tồn tại");
    }
    const SalaryRange = await useSalaryRange.create(data);
    return {
        success: true,
        data: SalaryRange,
    };
}

const updateSalaryRange = async (idl, data) => {
    const isSalaryRange = await useSalaryRange.findByOne({ salaryRange: data.salaryRange });
    if (isSalaryRange) {
        throw new Error("Khoảng lương đã tồn tại");
    }
    const updatedSalaryRange = await useSalaryRange.updatebyOne({ _id: idl }, { ...data });
    return {
        success: true,
        data: updatedSalaryRange,
    };
}

const getAllSalaryRange = async () => {
    const SalaryRange = await useSalaryRange.findAll({});
    return {
        success: true,
        data: SalaryRange,
    };
}

const deleteSalaryRange = async (idl) => {
    const existSalaryRange = await useSalaryRange.findByOne({ _id: idl });
    if (!existSalaryRange) {
        throw new Error("Không tìm thấy khoảng lương để xóa");
    }
    await useSalaryRange.deletebyOne({ _id: idl });
    return {
        success: true,
        mes: "Xóa khoảng lương thành công",
    };
}

module.exports = {
    createSalaryRange,
    updateSalaryRange,
    getAllSalaryRange,
    deleteSalaryRange,
}
