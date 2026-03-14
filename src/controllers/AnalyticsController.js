const analyticsSchema = require("../models/AnalyticsModel")

const createAnalytics = async (req, res) => {
    try {
        const createdAnalytics = await analyticsSchema.create(req.body);
        res.json({
            message: "Analytics created successfully",
            data: createdAnalytics
        });
    } catch (error) {
        res.json({
            message: "Error creating analytics",
            error: error
        });
    }
}

const getAllAnalytics = async (req, res) => {
    try {
        const allAnalytics = await analyticsSchema
            .find()
            .populate("campaign_id");
        res.json({
            message: "Analytics fetched successfully",
            data: allAnalytics
        });
    } catch (error) {
        res.json({
            message: "Error fetching analytics",
            error: error
        });
    }
}

const getCampaignAnalytics = async (req, res) => {
    try {
        const campaignAnalytics = await analyticsSchema
            .find({ campaign_id: req.params.campaign_id })
            .populate("campaign_id");

        if (campaignAnalytics) {
            res.json({
                message: "Campaign analytics fetched successfully",
                data: campaignAnalytics
            });
        } else {
            res.status(404).json({
                message: "Campaign analytics not found"
            })
        }
    } catch (error) {
        res.json({
            message: "Error fetching campaign analytics",
            error: error
        });
    }
}

const updateImpression = async (req, res) => {
    try {
        const updatedAnalytics = await analyticsSchema.findOneAndUpdate(
            { campaign_id: req.params.campaign_id },
            { $inc: { impressions: 1 } },
            { new: true }
        )
        res.json({
            message: "Impression updated",
            data: updatedAnalytics
        });
    } catch (error) {
        res.json({
            message: "Error updating impression",
            error: error
        })
    }
}

const updateClicks = async (req, res) => {
    try {
        const updatedAnalytics = await analyticsSchema.findOneAndUpdate(
            { campaign_id: req.params.campaign_id },
            { $inc: { clicks: 1 } },
            { new: true }
        )
        res.json({
            message: "Clicks updated",
            data: updatedAnalytics
        });
    } catch (error) {
        res.json({
            message: "Error updating clicks",
            error: error
        });
    }
}

const updateConversions = async (req, res) => {
    try {
        const updatedAnalytics = await analyticsSchema.findOneAndUpdate(
            { campaign_id: req.params.campaign_id },
            { $inc: { conversions: 1 } },
            { new: true }
        )
        res.json({
            message: "Conversions updated",
            data: updatedAnalytics
        })
    } catch (error) {
        res.json({
            message: "Error updating conversions",
            error: error
        })
    }
}

module.exports = {
    createAnalytics,
    getAllAnalytics,
    getCampaignAnalytics,
    updateImpression,
    updateClicks,
    updateConversions
}