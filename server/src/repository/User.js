const User = require("../modal/User")

const findByOne = (condition) => {
    return User.findOne(condition);
};

const findAll = (condition) => {
    return User.find(condition);
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
}