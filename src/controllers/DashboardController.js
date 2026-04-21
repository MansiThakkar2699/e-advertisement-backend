const userSchema = require("../models/UserModel");
const campaignSchema = require("../models/CampaignModel");
const advertisementSchema = require("../models/AdvertisementModel");
const contactSchema = require("../models/ContactModel");
const surveySchema = require("../models/SurveyModel");
const analyticsSchema = require("../models/AnalyticsModel");
const feedbackSchema = require("../models/FeedbackModel");

const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await userSchema.countDocuments({
            status: { $ne: "deleted" }
        });

        const totalViewers = await userSchema.countDocuments({
            role: "viewer",
            status: { $ne: "deleted" }
        });

        const totalAdvertisers = await userSchema.countDocuments({
            role: "advertiser",
            status: { $ne: "deleted" }
        });

        const pendingAdvertisers = await userSchema.countDocuments({
            role: "advertiser",
            status: "pending"
        });

        const totalCampaigns = await campaignSchema.countDocuments({
            status: { $ne: "deleted" }
        });

        const activeCampaigns = await campaignSchema.countDocuments({
            status: "active"
        });

        const totalAdvertisements = await advertisementSchema.countDocuments({
            status: { $ne: "deleted" }
        });

        const activeAdvertisements = await advertisementSchema.countDocuments({
            status: "active"
        });

        const totalContacts = await contactSchema.countDocuments({
            status: { $ne: "deleted" }
        });

        const totalSurveys = await surveySchema.countDocuments({
            status: { $ne: "deleted" }
        });

        let totalFeedbacks = 0;
        try {
            totalFeedbacks = await feedbackSchema.countDocuments({});
        } catch (error) {
            totalFeedbacks = 0;
        }

        const analytics = await analyticsSchema.find().sort({ recorded_date: 1 });

        const analyticsSummary = analytics.reduce(
            (acc, item) => {
                acc.impressions += item.impressions;
                acc.clicks += item.clicks;
                acc.conversions += item.conversions;
                return acc;
            },
            { impressions: 0, clicks: 0, conversions: 0 }
        );

        const ctr =
            analyticsSummary.impressions > 0
                ? ((analyticsSummary.clicks / analyticsSummary.impressions) * 100).toFixed(2)
                : 0;

        const recentUsers = await userSchema
            .find({ status: { $ne: "deleted" } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("fullName email role status createdAt profilePic");

        const recentCampaigns = await campaignSchema
            .find({ status: { $ne: "deleted" } })
            .populate("advertiser_id")
            .sort({ createdAt: -1 })
            .limit(5);

        const recentContacts = await contactSchema
            .find({ status: { $ne: "deleted" } })
            .sort({ createdAt: -1 })
            .limit(5);

        const userRoleChart = [
            { name: "Viewers", value: totalViewers },
            { name: "Advertisers", value: totalAdvertisers }
        ];

        const overviewBarChart = [
            { name: "Campaigns", total: totalCampaigns, active: activeCampaigns },
            { name: "Ads", total: totalAdvertisements, active: activeAdvertisements },
            { name: "Surveys", total: totalSurveys, active: totalSurveys },
            { name: "Contacts", total: totalContacts, active: totalContacts }
        ];

        const analyticsLineChart = analytics.map((item) => ({
            date: new Date(item.recorded_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short"
            }),
            impressions: item.impressions,
            clicks: item.clicks,
            conversions: item.conversions
        }));

        res.status(200).json({
            message: "Admin dashboard data fetched successfully",
            data: {
                stats: {
                    totalUsers,
                    totalViewers,
                    totalAdvertisers,
                    pendingAdvertisers,
                    totalCampaigns,
                    activeCampaigns,
                    totalAdvertisements,
                    activeAdvertisements,
                    totalContacts,
                    totalSurveys,
                    totalFeedbacks,
                    impressions: analyticsSummary.impressions,
                    clicks: analyticsSummary.clicks,
                    conversions: analyticsSummary.conversions,
                    ctr
                },
                charts: {
                    userRoleChart,
                    overviewBarChart,
                    analyticsLineChart
                },
                recentUsers,
                recentCampaigns,
                recentContacts
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching admin dashboard data",
            error: error.message
        });
    }
};

const getAdvertiserDashboard = async (req, res) => {
    try {
        const { advertiserId } = req.params;

        const campaigns = await campaignSchema.find({
            advertiser_id: advertiserId,
            status: { $ne: "deleted" }
        });

        const campaignIds = campaigns.map((item) => item._id);

        const advertisements = await advertisementSchema.find({
            campaign_id: { $in: campaignIds },
            status: { $ne: "deleted" }
        });

        const adIds = advertisements.map((item) => item._id);

        const totalCampaigns = campaigns.length;
        const activeCampaigns = campaigns.filter((item) => item.status === "active").length;
        const pendingCampaigns = campaigns.filter((item) => item.status === "pending").length;
        const pausedCampaigns = campaigns.filter((item) => item.status === "paused").length;

        const totalAdvertisements = advertisements.length;
        const activeAdvertisements = advertisements.filter((item) => item.status === "active").length;
        const pendingAdvertisements = advertisements.filter((item) => item.status === "pending").length;
        const rejectedAdvertisements = advertisements.filter((item) => item.status === "rejected").length;

        let totalFeedbacks = 0;
        let recentFeedbacks = [];
        try {
            totalFeedbacks = await feedbackSchema.countDocuments({
                ad_id: { $in: adIds }
            });

            recentFeedbacks = await feedbackSchema
                .find({ ad_id: { $in: adIds } })
                .populate("viewer_id")
                .populate("ad_id")
                .sort({ createdAt: -1 })
                .limit(5);
        } catch (error) {
            totalFeedbacks = 0;
            recentFeedbacks = [];
        }

        const advertiserSurveys = await surveySchema.countDocuments({
            campaign_id: { $in: campaignIds },
            status: { $ne: "deleted" }
        });

        const analytics = await analyticsSchema
            .find({ campaign_id: { $in: campaignIds } })
            .sort({ recorded_date: 1 });

        const analyticsSummary = analytics.reduce(
            (acc, item) => {
                acc.impressions += item.impressions;
                acc.clicks += item.clicks;
                acc.conversions += item.conversions;
                return acc;
            },
            { impressions: 0, clicks: 0, conversions: 0 }
        );

        const ctr =
            analyticsSummary.impressions > 0
                ? ((analyticsSummary.clicks / analyticsSummary.impressions) * 100).toFixed(2)
                : 0;

        const recentCampaigns = await campaignSchema
            .find({
                advertiser_id: advertiserId,
                status: { $ne: "deleted" }
            })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentAdvertisements = await advertisementSchema
            .find({
                campaign_id: { $in: campaignIds },
                status: { $ne: "deleted" }
            })
            .populate("campaign_id")
            .populate("category_id")
            .sort({ createdAt: -1 })
            .limit(5);

        const campaignStatusChart = [
            { name: "Active", value: activeCampaigns },
            { name: "Pending", value: pendingCampaigns },
            { name: "Paused", value: pausedCampaigns }
        ];

        const adStatusChart = [
            { name: "Active", value: activeAdvertisements },
            { name: "Pending", value: pendingAdvertisements },
            { name: "Rejected", value: rejectedAdvertisements }
        ];

        const analyticsLineChart = analytics.map((item) => ({
            date: new Date(item.recorded_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short"
            }),
            impressions: item.impressions,
            clicks: item.clicks,
            conversions: item.conversions
        }));

        const performanceBarChart = [
            { name: "Campaigns", total: totalCampaigns, active: activeCampaigns },
            { name: "Ads", total: totalAdvertisements, active: activeAdvertisements },
            { name: "Surveys", total: advertiserSurveys, active: advertiserSurveys },
            { name: "Feedbacks", total: totalFeedbacks, active: totalFeedbacks }
        ];

        res.status(200).json({
            message: "Advertiser dashboard data fetched successfully",
            data: {
                stats: {
                    totalCampaigns,
                    activeCampaigns,
                    pendingCampaigns,
                    pausedCampaigns,
                    totalAdvertisements,
                    activeAdvertisements,
                    pendingAdvertisements,
                    rejectedAdvertisements,
                    totalFeedbacks,
                    advertiserSurveys,
                    impressions: analyticsSummary.impressions,
                    clicks: analyticsSummary.clicks,
                    conversions: analyticsSummary.conversions,
                    ctr
                },
                charts: {
                    campaignStatusChart,
                    adStatusChart,
                    analyticsLineChart,
                    performanceBarChart
                },
                recentCampaigns,
                recentAdvertisements,
                recentFeedbacks
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching advertiser dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getAdminDashboard,
    getAdvertiserDashboard
}