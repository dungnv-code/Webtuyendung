const JobLevel = require("../modal/joblevel")

const findByOne = (condition) => {
    return JobLevel.findOne(condition);
};

const findAll = (condition) => {
    return JobLevel.find(condition);
};

const create = (data) => {
    return JobLevel.create(data);
};

const deletebyOne = (condition) => {
    return JobLevel.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return JobLevel.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
}