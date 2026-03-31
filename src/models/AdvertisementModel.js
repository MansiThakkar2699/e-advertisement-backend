const mongoose = require("mongoose");
const Schema = mongoose.Schema

const advertisementSchema = new Schema(
    {
        campaign_id: {
            type: mongoose.Types.ObjectId,
            ref: "campaigns"
        },
        category_id: {
            type: mongoose.Types.ObjectId,
            ref: "categories"
        },
        ad_title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        ad_type: {
            type: String,
            required: true,
            enum: ["Image", "Video"]
        },
        content: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "active", "paused", "rejected", "blocked", "deleted"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("advertisements", advertisementSchema);