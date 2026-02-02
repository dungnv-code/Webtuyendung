const Jobs = require("../modal/job")

const findByOne = (condition) => {
    return Jobs.findOne(condition);
};

const findAll = (condition) => {
    return Jobs.find(condition);
};

const create = (data) => {
    return Jobs.create(data);
};

const deletebyOne = (condition) => {
    return Jobs.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return Jobs.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
}