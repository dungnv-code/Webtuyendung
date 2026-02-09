const Invoice = require("../modal/Invoice")

const findByOne = (condition) => {
    return Invoice.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = Invoice.find(condition);
    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query;
};

const countDocuments = (condition = {}) => {
    return Invoice.countDocuments(condition);
};

const create = (data) => {
    return Invoice.create(data);
};

const deletebyOne = (condition) => {
    return Invoice.findOneAndDelete(condition);
};

const updatebyOne = (condition, data) => {
    return Invoice.findOneAndUpdate(condition, data, { new: true });
};


module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
    countDocuments,
}