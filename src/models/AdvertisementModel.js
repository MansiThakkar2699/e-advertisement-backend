const mongoose = require("mongoose");
const Schema = mongoose.Schema

const advertisementSchema = new Schema({
    advertiser_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: "categories"
    },
    ad_title: {
        type: String,
        required: true
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
        default: "active",
        enum: ["active", "inactive", "deleted", "blocked", "paused"]
    }
});

module.exports = mongoose.model("advertisements", advertisementSchema);