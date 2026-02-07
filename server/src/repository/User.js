const User = require("../modal/User")

const findByOne = (condition) => {
    return User.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = User.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return User.countDocuments(condition);
};

const createUser = (data) => {
    return User.create(data);
};

const deletebyOne = (condition) => {
    return User.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return User.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    createUser,
    deletebyOne,
    findAll,
    updatebyOne,
    countDocuments,
}