const Worktype = require("../modal/worktype")

const findByOne = (condition) => {
    return Worktype.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = Worktype.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return Worktype.countDocuments(condition);
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
    countDocuments,
}