const Business = require("../modal/Business")
const User = require("../modal/User")
const findByOne = (condition) => {
    return Business.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = Business.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return Business.countDocuments(condition);
};

const findAllUser = (condition) => {
    return User.find(condition);
};

const create = (data) => {
    return Business.create(data);
};

const deletebyOne = (condition) => {
    return Business.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return Business.findOneAndUpdate(condition, data, { new: true });
};

const updatebyOneUser = (condition, data) => {
    return User.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
    updatebyOneUser,
    findAllUser,
    countDocuments
}