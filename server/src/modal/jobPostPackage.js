const mongoose = require("mongoose");

const JobPostPackageSchema = new mongoose.Schema(
    {
        namePostPackage: {
            type: String,
            required: true,
            trim: true,     // Ví dụ: "GÓI CƠ BẢN", "GÓI PREMIUM"
        },

        valuePostPackage: {
            type: Number,
            required: true, // Số lượng tin đăng được phép đăng: 1, 3, 5
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
