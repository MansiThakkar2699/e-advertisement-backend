const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveyResponseSchema = new Schema(
    {
        survey_id: {
            type: mongoose.Types.ObjectId,
            ref: "surveys",
            required: true
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true
        },
        answers: [
            {
                question: {
                    type: String,
                    required: true
                },
                selectedOption: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("survey_responses", surveyResponseSchema);