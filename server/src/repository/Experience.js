const Experience = require("../modal/experience")

const findByOne = (condition) => {
    return Experience.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = Experience.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return Experience.countDocuments(condition);
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
    countDocuments,
}