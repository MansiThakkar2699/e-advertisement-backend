const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "viewer",
            enum: ["viewer", "advertiser", "admin"]
        },
        profilePic: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            default: "active",
            enum: ["active", "deleted", "pending", "blocked", "rejected"]
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("users", userSchema)