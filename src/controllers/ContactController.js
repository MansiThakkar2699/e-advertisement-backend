const contactSchema = require("../models/ContactModel");

// CREATE CONTACT MESSAGE
const createContactMessage = async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;

        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newMessage = await contactSchema.create({
            fullName,
            email,
            subject,
            message
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while sending message",
            error: error.message
        });
    }
};

// GET ALL CONTACT MESSAGES (ADMIN)
const getAllContactMessages = async (req, res) => {
    try {
        const messages = await contactSchema
            .find({ status: { $ne: "deleted" } })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Contact messages fetched successfully",
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching contact messages",
            error: error.message
        });
    }
};

// GET CONTACT MESSAGE BY ID
const getContactMessageById = async (req, res) => {
    try {
        const message = await contactSchema.findById(req.params.id);

        if (!message || message.status === "deleted") {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Contact message fetched successfully",
            data: message
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching contact message",
            error: error.message
        });
    }
};

// UPDATE CONTACT MESSAGE STATUS
const updateContactMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const updatedMessage = await contactSchema.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Contact message status updated successfully",
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating contact message status",
            error: error.message
        });
    }
};

// SOFT DELETE CONTACT MESSAGE
const deleteContactMessage = async (req, res) => {
    try {
        const deletedMessage = await contactSchema.findByIdAndUpdate(
            req.params.id,
            { status: "deleted" },
            { new: true }
        );

        if (!deletedMessage) {
            return res.status(404).json({
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            message: "Contact message deleted successfully",
            data: deletedMessage
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error while deleting contact message",
            error: error.message
        });
    }
};

module.exports = {
    createContactMessage,
    getAllContactMessages,
    getContactMessageById,
    updateContactMessageStatus,
    deleteContactMessage
};