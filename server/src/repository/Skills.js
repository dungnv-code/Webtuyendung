const Skill = require("../modal/skill")

const findByOne = (condition) => {
    return Skill.findOne(condition);
};

const findAll = (condition) => {
    return Skill.find(condition);
};

const create = (data) => {
    return Skill.create(data);
};

const deletebyOne = (condition) => {
    return Skill.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return Skill.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
}