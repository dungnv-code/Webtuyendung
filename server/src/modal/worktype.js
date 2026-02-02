const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkTypeSchema = new Schema({
    workType: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model("WorkType", WorkTypeSchema);
