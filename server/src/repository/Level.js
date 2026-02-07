const JobLevel = require("../modal/joblevel")

const findByOne = (condition) => {
    return JobLevel.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = JobLevel.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return JobLevel.countDocuments(condition);
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
    countDocuments,
}