const advertisementSchema = require("../models/AdvertisementModel");
const categorySchema = require("../models/CategoryModel");
const userSchema = require("../models/UserModel");
const campaignSchema = require("../models/CampaignModel");
const surveySchema = require("../models/SurveyModel");

const getHomeStats = async (req, res) => {
    try {
        const activePromotions = await advertisementSchema.countDocuments({
            status: "active"
        });

        const topCategories = await categorySchema.countDocuments({
            status: "active"
        });

        const happyViewers = await userSchema.countDocuments({
            role: "viewer",
            status: "active"
        });

        const interactiveSurveys = await surveySchema.countDocuments({
            status: "active"
        });

        const campaigns = await campaignSchema.countDocuments({
            status: "active"
        });

        res.status(200).json({
            message: "Home stats fetched successfully",
            data: {
                activePromotions,
                topCategories,
                happyViewers,
                interactiveSurveys,
                campaigns
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching home stats",
            error: error.message
        });
    }
};

module.exports = {
    getHomeStats
};