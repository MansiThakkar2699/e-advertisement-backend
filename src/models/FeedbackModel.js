const mongoose = require("mongoose");
const Schema = mongoose.Schema

const feedbackSchema = new Schema({
    ad_id: {
        type: mongoose.Types.ObjectId,
        ref: "advertisements"
    },
    viewer_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comments: {
        type: String
    }
});

module.exports = mongoose.model("feedbacks", feedbackSchema);