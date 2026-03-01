const mongoose = require("mongoose");

const PostJobSchema = new mongoose.Schema({

    imageCover: {
        type: String,
        required: true,
    },

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
        type: String,
        required: true
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

    view: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["pendding", "active"],
        default: "pendding"
    },

    userPost: {
        type: String,
    },

    statusPause: {
        type: Boolean,
        default: false,
    },

    listCV: [
        {
            idUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            ratio: {
                type: Number,
            },
            description: {
                type: String,
            },
            evaluate: {
                type: String,
            },
            fileCV: {
                type: String,
            }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("PostJob", PostJobSchema);
