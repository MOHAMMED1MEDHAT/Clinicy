const mongoose = require("mongoose");
// const valid=require('validator');
// const jwt=require("jsonwebtoken");

const clinickSchema = mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true,
    },
    clinicName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    openDates: {
        type: Object,
        required: true,
    },
    rating: {
        type: Number,
        default: 0.0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    about: {
        type: String,
        default: "this is about",
    },
    reservedDates: {
        type: Array,
    },
});

clinickSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

clinickSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("clinick", clinickSchema);
