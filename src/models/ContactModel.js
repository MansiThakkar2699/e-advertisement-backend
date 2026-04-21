const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            default: "new",
            enum: ["new", "read", "replied", "deleted"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("contacts", contactSchema);