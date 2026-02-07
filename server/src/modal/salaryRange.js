const mongoose = require("mongoose");
const SalaryRangeSchema = new mongoose.Schema(
    {
        salaryRange: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        min: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

        max: {
            type: Number,
            default: null,
            validate: {
                validator: function (value) {
                    return value === null || value > this.min;
                },
                message: "max phải lớn hơn min"
            }
        },

    },
    { timestamps: true }
);

SalaryRangeSchema.index({ min: 1, max: 1 });

module.exports = mongoose.model("SalaryRange", SalaryRangeSchema);
