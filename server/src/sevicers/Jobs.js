const useJob = require("../repository/Jobs");

const createJob = async (data) => {
    const existJob = await useJob.findByOne({ slug: data.slug });
    if (existJob) {
        throw new Error("Job with this slug already exists");
    }
    const job = await useJob.create(data);
    return {
        success: true,
        data: job,
    };
}

const updateJob = async (idj, data) => {
    const existJob = await useJob.findByOne({ _id: idj });
    if (!existJob) {
        throw new Error("Không tìm thấy job");
    }
    const updatedJob = await useJob.updatebyOne({ _id: idj }, data);
    return {
        success: true,
        data: updatedJob,
    };
}

const getAllJobs = async () => {
    const jobs = await useJob.findAll({});
    return {
        success: true,
        data: jobs,
    };
}

const deleteJob = async (idj) => {
    const existJob = await useJob.findByOne({ _id: idj });
    if (!existJob) {
        throw new Error("Không tìm thấy job để xóa");
    }
    await useJob.deletebyOne({ _id: idj });
    return {
        success: true,
        mes: "Xóa job thành công",
    };
}

module.exports = {
    createJob,
    updateJob,
    getAllJobs,
    deleteJob,
};