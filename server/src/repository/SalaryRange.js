const salaryRange = require("../modal/salaryRange")

const findByOne = (condition) => {
    return salaryRange.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = salaryRange.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return salaryRange.countDocuments(condition);
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
    countDocuments,
}