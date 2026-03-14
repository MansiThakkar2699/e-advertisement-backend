const feedbackSchema = require("../models/FeedbackModel")

const createFeedback = async (req, res) => {
    try {
        const createdFeedback = await feedbackSchema.create(req.body);
        res.json({
            message: "Feedback created successfully",
            data: createdFeedback
        });
    } catch (error) {
        res.json({
            message: "Error creating feedback",
            error: error
        });
    }
}

const getAllFeedback = async (req, res) => {
    try {
        const allFeedback = await feedbackSchema
            .find()
            .populate("viewer_id")
            .populate("ad_id");
        res.json({
            message: "All feedback fetched successfully",
            data: allFeedback
        });
    } catch (error) {
        res.json({
            message: "Error fetching feedback",
            error: error
        })
    }
}

const updateFeedback = async (req, res) => {
    try {
        const updatedFeedback = await feedbackSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (updatedFeedback) {
            res.json({
                message: "Feedback updated successfully",
                data: updatedFeedback
            });
        } else {
            res.status(404).json({
                message: "Feedback not found"
            })
        }
    } catch (error) {
        res.json({
            message: "Error updating feedback",
            error: error
        });
    }
}

const getFeedbackByAdvertisement = async (req, res) => {
    try {
        const feedback = await feedbackSchema
            .find({ ad_id: req.params.advertisement_id })
            .populate("viewer_id");
        res.json({
            message: "Feedback for advertisement fetched successfully",
            data: feedback
        });
    } catch (error) {
        res.json({
            message: "Error fetching feedback",
            error: error
        });
    }
}

const getFeedbackByViewer = async (req, res) => {
    try {
        const feedback = await feedbackSchema
            .find({ viewer_id: req.params.viewer_id })
            .populate("ad_id");
        res.json({
            message: "Viewer feedback fetched successfully",
            data: feedback
        });
    } catch (error) {
        res.json({
            message: "Error fetching feedback",
            error: error
        });
    }
}

module.exports = {
    createFeedback,
    getAllFeedback,
    updateFeedback,
    getFeedbackByAdvertisement,
    getFeedbackByViewer
}