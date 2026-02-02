const salaryRange = require("../modal/salaryRange")

const findByOne = (condition) => {
    return salaryRange.findOne(condition);
};

const findAll = (condition) => {
    return salaryRange.find(condition);
};

const create = (data) => {
    return salaryRange.create(data);
};

const deletebyOne = (condition) => {
    return salaryRange.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return salaryRange.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
}