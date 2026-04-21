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
            default: "Image",
            enum: ["Image", "Video"]
        },
        content: {
            type: String,
            required: true
        },
        offer: {
            title: {
                type: String,
                default: ""
            },
            value: {
                type: String,
                default: ""
            },
            expiry: {
                type: Date
            }
        },
        design_json: {
            canvas: {
                width: { type: Number, default: 800 },
                height: { type: Number, default: 450 },
                backgroundColor: { type: String, default: "#ffffff" }
            },
            elements: [
                {
                    id: { type: String, required: true },
                    type: {
                        type: String,
                        enum: ["text", "image", "button"],
                        required: true
                    },
                    x: { type: Number, default: 0 },
                    y: { type: Number, default: 0 },
                    width: { type: Number, default: 100 },
                    height: { type: Number, default: 50 },
                    text: { type: String, default: "" },
                    src: { type: String, default: "" },
                    style: {
                        color: { type: String, default: "#111827" },
                        fontSize: { type: Number, default: 16 },
                        fontWeight: { type: String, default: "400" },
                        textAlign: { type: String, default: "left" },
                        backgroundColor: { type: String, default: "transparent" },
                        borderRadius: { type: Number, default: 0 }
                    }
                }
            ]
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