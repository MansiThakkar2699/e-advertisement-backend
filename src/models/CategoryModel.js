const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        slug: {
            type: String,
            required: true,
            unique: true
        },

        description: {
            type: String
        },

        image: {
            type: String
        },

        status: {
            type: String,
            enum: ["active", "inactive", "deleted"],
            default: "active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("categories", categorySchema);