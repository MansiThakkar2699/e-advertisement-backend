const surveySchema = require("../models/SurveyModel");
const surveyResponseSchema = require("../models/SurveyResponseModel");
const analyticsSchema = require("../models/AnalyticsModel");
const campaignSchema = require("../models/CampaignModel");

// create survey (admin)
const createSurvey = async (req, res) => {
    try {
        const { title, description, category_id, campaign_id, questions } = req.body;

        const survey = await surveySchema.create({
            title,
            description,
            category_id: category_id || null,
            campaign_id: campaign_id || null,
            questions,
            status: "active"
        });

        res.status(201).json({
            message: "Survey created successfully",
            data: survey
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while creating survey",
            error: error.message
        });
    }
};

// get all active surveys for viewer
const getActiveSurveys = async (req, res) => {
    try {
        const surveys = await surveySchema
            .find({ status: "active" })
            .populate("category_id")
            .populate("campaign_id")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Surveys fetched successfully",
            data: surveys
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching surveys",
            error: error.message
        });
    }
};

// get survey by id
const getSurveyById = async (req, res) => {
    try {
        const survey = await surveySchema
            .findById(req.params.id)
            .populate("category_id")
            .populate("campaign_id");

        if (!survey || survey.status === "deleted") {
            return res.status(404).json({
                message: "Survey not found"
            });
        }

        res.status(200).json({
            message: "Survey fetched successfully",
            data: survey
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching survey",
            error: error.message
        });
    }
};

// submit survey response
const submitSurveyResponse = async (req, res) => {
    try {
        const { survey_id, user_id, answers, ad_id } = req.body;

        const existingResponse = await surveyResponseSchema.findOne({
            survey_id,
            user_id
        });

        if (existingResponse) {
            return res.status(400).json({
                message: "You have already submitted this survey"
            });
        }

        const responseData = await surveyResponseSchema.create({
            survey_id,
            user_id,
            answers
        });

        // optional: if linked to ad, increment conversion
        if (ad_id) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date();
            tomorrow.setHours(23, 59, 59, 999);

            const existingAnalytics = await analyticsSchema.findOne({
                ad_id,
                recorded_date: { $gte: today, $lte: tomorrow }
            });

            if (existingAnalytics) {
                existingAnalytics.conversions += 1;
                await existingAnalytics.save();
            }
        }

        res.status(201).json({
            message: "Survey submitted successfully",
            data: responseData
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while submitting survey",
            error: error.message
        });
    }
};

// get all surveys for admin
const getAllSurveys = async (req, res) => {
    try {
        const surveys = await surveySchema
            .find({ status: { $ne: "deleted" } })
            .populate("category_id")
            .populate("campaign_id")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All surveys fetched successfully",
            data: surveys
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching all surveys",
            error: error.message
        });
    }
};

// update survey
const updateSurvey = async (req, res) => {
    try {
        const updatedSurvey = await surveySchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedSurvey) {
            return res.status(404).json({
                message: "Survey not found"
            });
        }

        res.status(200).json({
            message: "Survey updated successfully",
            data: updatedSurvey
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating survey",
            error: error.message
        });
    }
};

// delete survey
const deleteSurvey = async (req, res) => {
    try {
        const deletedSurvey = await surveySchema.findByIdAndUpdate(
            req.params.id,
            { status: "deleted" },
            { new: true }
        );

        if (!deletedSurvey) {
            return res.status(404).json({
                message: "Survey not found"
            });
        }

        res.status(200).json({
            message: "Survey deleted successfully",
            data: deletedSurvey
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting survey",
            error: error.message
        });
    }
};

// get survey responses for admin
const getSurveyResponses = async (req, res) => {
    try {
        const responses = await surveyResponseSchema
            .find({ survey_id: req.params.surveyId })
            .populate("user_id")
            .populate("survey_id")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Survey responses fetched successfully",
            data: responses
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching survey responses",
            error: error.message
        });
    }
};

const getAdvertiserSurveys = async (req, res) => {
    try {
        const { advertiserId } = req.params;

        const campaigns = await campaignSchema.find({ advertiser_id: advertiserId }).select("_id");
        const campaignIds = campaigns.map((item) => item._id);

        const surveys = await surveySchema
            .find({
                campaign_id: { $in: campaignIds },
                status: { $ne: "deleted" }
            })
            .populate("category_id")
            .populate("campaign_id")
            .sort({ createdAt: -1 });

        const surveyResponseSchema = require("../models/SurveyResponseModel");

        const data = await Promise.all(
            surveys.map(async (survey) => {
                const responseCount = await surveyResponseSchema.countDocuments({
                    survey_id: survey._id
                });

                return {
                    ...survey.toObject(),
                    responseCount
                };
            })
        );

        res.status(200).json({
            message: "Advertiser surveys fetched successfully",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching advertiser surveys",
            error: error.message
        });
    }
};

module.exports = {
    createSurvey,
    getActiveSurveys,
    getSurveyById,
    submitSurveyResponse,
    getAllSurveys,
    updateSurvey,
    deleteSurvey,
    getSurveyResponses,
    getAdvertiserSurveys
};