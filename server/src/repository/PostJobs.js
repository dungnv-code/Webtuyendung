const PostJobs = require("../modal/PostJobs")

const findByOne = (condition) => {
    return PostJobs.findOne(condition);
};

const findAll = (condition, options = {}) => {
    let query = PostJobs.find(condition);

    if (options.fields) query = query.select(options.fields);
    if (options.sort) query = query.sort(options.sort);
    if (options.skip) query = query.skip(options.skip);
    if (options.limit) query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    return query.lean();
};

const countDocuments = (condition = {}) => {
    return PostJobs.countDocuments(condition);
};

const create = (data) => {
    return PostJobs.create(data);
};

const deletebyOne = (condition) => {
    return PostJobs.findOneAndDelete(condition);
}

const updatebyOne = (condition, data) => {
    return PostJobs.findOneAndUpdate(condition, data, { new: true });
};

module.exports = {
    findByOne,
    create,
    deletebyOne,
    findAll,
    updatebyOne,
    countDocuments,
}