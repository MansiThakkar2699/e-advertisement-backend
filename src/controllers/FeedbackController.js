const mongoose = require("mongoose")
const feedbackSchema = require("../models/FeedbackModel")
const logger = require('../utils/logger');

const createFeedback = async (req, res) => {
    try {
        const createdFeedback = await feedbackSchema.create(req.body);
        res.json({
            message: "Feedback created successfully",
            data: createdFeedback
        });
    } catch (error) {
        logger.error("Error creating feedback", error)
        res.json({
            message: "Error creating feedback",
            error: error
        });
    }
}

const getAllFeedback = async (req, res) => {
    try {

        const {
            search = "",
            advertisement,
            sort,
            page = 1,
            limit = 6
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        let matchStage = {};

        // Filter by advertisement
        if (advertisement) {
            matchStage.ad_id = new mongoose.Types.ObjectId(advertisement);
        }

        let sortStage = {};

        if (sort === "high") sortStage.rating = -1;
        if (sort === "low") sortStage.rating = 1;

        const pipeline = [

            { $match: matchStage },

            // Join viewer
            {
                $lookup: {
                    from: "users",
                    localField: "viewer_id",
                    foreignField: "_id",
                    as: "viewer"
                }
            },

            { $unwind: "$viewer" },

            // Join advertisement
            {
                $lookup: {
                    from: "advertisements",
                    localField: "ad_id",
                    foreignField: "_id",
                    as: "advertisement"
                }
            },

            { $unwind: "$advertisement" },

            // Search viewer name
            {
                $match: {
                    "viewer.fullName": {
                        $regex: search,
                        $options: "i"
                    }
                }
            },

            // Sort rating
            ...(Object.keys(sortStage).length ? [{ $sort: sortStage }] : []),

            // Pagination + total count
            {
                $facet: {
                    metadata: [
                        { $count: "totalRecords" }
                    ],
                    data: [
                        { $skip: (pageNumber - 1) * limitNumber },
                        { $limit: limitNumber }
                    ]
                }
            }
        ];

        const result = await feedbackSchema.aggregate(pipeline);

        const feedbacks = result[0].data;
        const totalRecords = result[0].metadata[0]?.totalRecords || 0;

        res.json({
            message: "All feedback fetched successfully",
            currentPage: pageNumber,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limitNumber),
            data: feedbacks
        });
    } catch (error) {
        logger.error("Error fetching feedback", error)
        res.status(500).json({
            message: "Error fetching feedback",
            error: error
        });

    }
};

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
            logger.error("Feedback not found")
            res.status(404).json({
                message: "Feedback not found"
            })
        }
    } catch (error) {
        logger.error("Error updating feedback", error)
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
        logger.error("Error fetching feedback", error)
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
        logger.error("Error fetching feedback", error)
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