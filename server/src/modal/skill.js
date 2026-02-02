const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
    nameskill: { type: String, required: true },
    job: { type: Schema.Types.ObjectId, ref: "Jobs", required: true },
}, { timestamps: true })

module.exports = mongoose.model("Skill", SkillSchema);