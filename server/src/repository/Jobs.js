const Jobs = require("../modal/job")

const findByOne = (condition) => {
    return Jobs.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = Jobs.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return Jobs.countDocuments(condition);
};

const create = (data) => {
    return Jobs.create(data);
};

const deletebyOne = (condition) => {
    return Jobs.findOneAndDelete(condition);
};

const updatebyOne = (condition, data) => {
    return Jobs.findOneAndUpdate(condition, data, { new: true });
};


module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
    countDocuments,
}