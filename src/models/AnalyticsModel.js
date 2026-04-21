const mongoose = require("mongoose");
const Schema = mongoose.Schema

const analyticsSchema = new Schema(
    {
        campaign_id: {
            type: mongoose.Types.ObjectId,
            ref: "campaigns"
        },
        ad_id: {
            type: mongoose.Types.ObjectId,
            ref: "advertisements",
        },
        impressions: {
            type: Number,
            default: 0
        },
        clicks: {
            type: Number,
            default: 0
        },
        conversions: {
            type: Number,
            default: 0
        },
        recorded_date: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("analytics", analyticsSchema);