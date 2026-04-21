const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        category_id: {
            type: mongoose.Types.ObjectId,
            ref: "categories",
            default: null
        },
        campaign_id: {
            type: mongoose.Types.ObjectId,
            ref: "campaigns",
            default: null
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true
                },
                options: [
                    {
                        type: String
                    }
                ]
            }
        ],
        status: {
            type: String,
            default: "active",
            enum: ["active", "inactive", "deleted"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("surveys", surveySchema);