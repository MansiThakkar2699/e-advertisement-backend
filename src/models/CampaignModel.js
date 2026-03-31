const mongoose = require("mongoose");
const Schema = mongoose.Schema

const campaignSchema = new Schema(
    {
        advertiser_id: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        name: {
            type: String,
            required: true
        },
        totalBudget: {
            type: Number
        },

        dailyBudget: {
            type: Number
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
        },
        platforms: [
            {
                type: String
            }
        ],
        targetAudience: {

            ageMin: Number,
            ageMax: Number,

            gender: {
                type: String,
                enum: ["male", "female", "all"],
                default: "all"
            },

            location: String,

            interests: [
                {
                    type: String
                }
            ]
        },
        status: {
            type: String,
            default: "pending",
            enum: ["active", "paused", "completed", "deleted", "rejected", "pending"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("campaigns", campaignSchema);