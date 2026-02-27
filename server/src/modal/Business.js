const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
    nameBusiness: { type: String, required: true },
    taxiCodeBusiness: { type: String, required: true },
    descriptionBusiness: { type: String, required: true },
    addressBusiness: { type: String, required: true },
    FieldBusiness: { type: String, required: true },
    phoneBusiness: { type: String, required: true },
    websiteBusiness: { type: String, default: null },
    numberOfEmployees: { type: String, default: null },
    imageCoverBusiness: { type: String, default: "https://i.pinimg.com/736x/aa/8e/c0/aa8ec02bdd6609ac23f47a3e2a90e4a9.jpg" },
    imageAvatarBusiness: { type: String, default: "https://i.pinimg.com/736x/aa/8e/c0/aa8ec02bdd6609ac23f47a3e2a90e4a9.jpg" },
    certification: { type: String, default: null },
    statusBusiness: { type: Boolean, default: false },
    statusActive: { type: String, enum: ["Block", "Active"], default: "Active" },
    normalPosts: { type: Number, default: 5 },
    featuredPosts: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("Business", BusinessSchema);