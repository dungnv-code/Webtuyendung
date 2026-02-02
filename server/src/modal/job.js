const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobsSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true })

module.exports = mongoose.model("Jobs", JobsSchema);