const mongoose = require("mongoose");

const PostJobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        unique: true,
        index: true
    },

    description: {
        type: String,
        required: true
    },

    jobs: {
        type: String,
        required: true
    },

    experience: {
        type: String,
        required: true
    },

    salaryRange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalaryRange",
        required: true
    },

    joblevel: {
        type: String,
        required: true
    },

    workType: {
        type: String,
        required: true
    },

    location: {
        city: { type: String },
        district: { type: String },
        address: { type: String }
    },

    postPackage: {
        type: Number,
        enum: [0, 1],
        required: true
    },

    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },

    skills: [{
        type: String,
        required: true
    }],

    quantity: {
        type: Number,
        default: 1
    },

    deadline: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["pendding", "active", "unactive"],
        default: "pendding"
    }

}, { timestamps: true });

module.exports = mongoose.model("PostJob", PostJobSchema);
