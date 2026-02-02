const Worktype = require("../modal/worktype")

const findByOne = (condition) => {
    return Worktype.findOne(condition);
};

const findAll = (condition) => {
    return Worktype.find(condition);
};

const createWorktype = (data) => {
    return Worktype.create(data);
};

const deletebyOne = (condition) => {
    return Worktype.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return Worktype.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    createWorktype,
    deletebyOne,
    findAll,
    updatebyOne,
}