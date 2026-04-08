const mongoose = require("mongoose");

const JobPostPackageSchema = new mongoose.Schema(
    {
        namePostPackage: {
            type: String,
            required: true,
            trim: true,
        },
        valuePostPackage: {
            type: Number,
            required: true,
        },
        typePostPackage: {
            type: String,
            enum: ["BASIC", "PREMIUM"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("JobPostPackage", JobPostPackageSchema);
