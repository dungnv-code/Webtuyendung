const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobLevelSchema = new Schema({
    nameLevel: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("JobLevel", JobLevelSchema);
