const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoidSchema = new Schema({
    typeInvoid: { type: String, required: true },
    title: { type: String, required: true },
    value: { type: Number, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Invoid", InvoidSchema);