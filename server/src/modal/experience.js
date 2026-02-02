const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
    experience: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true })

module.exports = mongoose.model("Experience", ExperienceSchema);