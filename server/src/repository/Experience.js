const Experience = require("../modal/experience")

const findByOne = (condition) => {
    return Experience.findOne(condition);
};

const findAll = (condition) => {
    return Experience.find(condition);
};

const create = (data) => {
    return Experience.create(data);
};

const deletebyOne = (condition) => {
    return Experience.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return Experience.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
}