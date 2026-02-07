const Skill = require("../modal/skill")

const findByOne = (condition) => {
    return Skill.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = Skill.find(condition);

    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query.lean();
};

const countDocuments = (condition = {}) => {
    return Skill.countDocuments(condition);
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
    countDocuments,
}