const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, default: "https://i.pinimg.com/736x/d6/23/56/d62356a6fb9ac4495c543629e36eb561.jpg" },
    refreshToken: { type: String, default: null },
    status: { type: String, enum: ["Block", "Active"], default: "Active" },
    resetpasswordOtp: { type: String, default: null },
    resetpasswordOtpExpire: { type: Date, default: null },
    business: { type: Schema.Types.ObjectId, ref: "Business", default: null }
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema);