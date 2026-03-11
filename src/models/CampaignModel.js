const mongoose = require("mongoose");
const Schema = mongoose.Schema

const campaignSchema = new Schema({
    ad_id: {
        type: mongoose.Types.ObjectId,
        ref: "advertisements"
    },
    budget: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    target_location: {
        type: String,
        required: true
    },
    target_age: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "deleted", "blocked"]
    }
});

module.exports = mongoose.model("campaigns", campaignSchema);