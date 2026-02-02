const jobPostPackage = require("../modal/jobPostPackage")

const findByOne = (condition) => {
    return jobPostPackage.findOne(condition);
};

const findAll = (condition) => {
    return jobPostPackage.find(condition);
};

const create = (data) => {
    return jobPostPackage.create(data);
};

const deletebyOne = (condition) => {
    return jobPostPackage.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return jobPostPackage.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
}