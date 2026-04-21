const analyticsSchema = require("../models/AnalyticsModel");
const advertisementSchema = require("../models/AdvertisementModel");
const campaignSchema = require("../models/CampaignModel");
const userSchema = require("../models/UserModel");

// helper: get today's date start and end
const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

// helper: find or create today's analytics row
const findOrCreateTodayAnalytics = async (adId) => {
    const advertisement = await advertisementSchema.findById(adId);

    if (!advertisement) {
        throw new Error("Advertisement not found");
    }

    const { start, end } = getTodayRange();

    let analytics = await analyticsSchema.findOne({
        ad_id: adId,
        recorded_date: { $gte: start, $lte: end }
    });

    if (!analytics) {
        analytics = await analyticsSchema.create({
            campaign_id: advertisement.campaign_id,
            ad_id: advertisement._id,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            recorded_date: new Date()
        });
    }

    return analytics;
};

// increment impression
const incrementImpression = async (req, res) => {
    try {
        const { adId } = req.params;

        const analytics = await findOrCreateTodayAnalytics(adId);
        analytics.impressions += 1;
        await analytics.save();

        res.status(200).json({
            message: "Impression recorded successfully",
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while recording impression",
            error: error.message
        });
    }
};

// increment click
const incrementClick = async (req, res) => {
    try {
        const { adId } = req.params;

        const analytics = await findOrCreateTodayAnalytics(adId);
        analytics.clicks += 1;
        await analytics.save();

        res.status(200).json({
            message: "Click recorded successfully",
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while recording click",
            error: error.message
        });
    }
};

// increment conversion
const incrementConversion = async (req, res) => {
    try {
        const { adId } = req.params;

        const analytics = await findOrCreateTodayAnalytics(adId);
        analytics.conversions += 1;
        await analytics.save();

        res.status(200).json({
            message: "Conversion recorded successfully",
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while recording conversion",
            error: error.message
        });
    }
};

// advertiser analytics summary
const getAdvertiserAnalytics = async (req, res) => {
    try {
        const { advertiserId } = req.params;

        const campaigns = await campaignSchema.find({ advertiser_id: advertiserId }).select("_id");
        const campaignIds = campaigns.map((item) => item._id);

        const analytics = await analyticsSchema.find({
            campaign_id: { $in: campaignIds }
        });

        const summary = analytics.reduce(
            (acc, item) => {
                acc.impressions += item.impressions;
                acc.clicks += item.clicks;
                acc.conversions += item.conversions;
                return acc;
            },
            { impressions: 0, clicks: 0, conversions: 0 }
        );

        const ctr =
            summary.impressions > 0
                ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                : 0;

        res.status(200).json({
            message: "Advertiser analytics fetched successfully",
            data: {
                ...summary,
                ctr
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching advertiser analytics",
            error: error.message
        });
    }
};

// campaign wise analytics
const getCampaignAnalytics = async (req, res) => {
    try {
        const { campaignId } = req.params;

        const analytics = await analyticsSchema.find({ campaign_id: campaignId }).populate("ad_id");

        const summary = analytics.reduce(
            (acc, item) => {
                acc.impressions += item.impressions;
                acc.clicks += item.clicks;
                acc.conversions += item.conversions;
                return acc;
            },
            { impressions: 0, clicks: 0, conversions: 0 }
        );

        const ctr =
            summary.impressions > 0
                ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                : 0;

        res.status(200).json({
            message: "Campaign analytics fetched successfully",
            data: {
                summary: {
                    ...summary,
                    ctr
                },
                records: analytics
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching campaign analytics",
            error: error.message
        });
    }
};

// admin analytics summary
const getAdminAnalytics = async (req, res) => {
    try {
        const analytics = await analyticsSchema.find();

        const summary = analytics.reduce(
            (acc, item) => {
                acc.impressions += item.impressions;
                acc.clicks += item.clicks;
                acc.conversions += item.conversions;
                return acc;
            },
            { impressions: 0, clicks: 0, conversions: 0 }
        );

        const ctr =
            summary.impressions > 0
                ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                : 0;

        res.status(200).json({
            message: "Admin analytics fetched successfully",
            data: {
                ...summary,
                ctr
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching admin analytics",
            error: error.message
        });
    }
};

const getAdvertiserCampaignAnalytics = async (req, res) => {
    try {
        const { advertiserId } = req.params;

        const campaigns = await campaignSchema.find({ advertiser_id: advertiserId });

        const data = [];

        for (const campaign of campaigns) {
            const analytics = await analyticsSchema.find({ campaign_id: campaign._id });

            const summary = analytics.reduce(
                (acc, item) => {
                    acc.impressions += item.impressions;
                    acc.clicks += item.clicks;
                    acc.conversions += item.conversions;
                    return acc;
                },
                { impressions: 0, clicks: 0, conversions: 0 }
            );

            const ctr =
                summary.impressions > 0
                    ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                    : 0;

            data.push({
                campaign_id: campaign._id,
                campaign_name: campaign.name,
                impressions: summary.impressions,
                clicks: summary.clicks,
                conversions: summary.conversions,
                ctr
            });
        }

        res.status(200).json({
            message: "Advertiser campaign analytics fetched successfully",
            data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching advertiser campaign analytics",
            error: error.message
        });
    }
};

const getAdvertiserAdAnalytics = async (req, res) => {
    try {
        const { advertiserId } = req.params;

        const campaigns = await campaignSchema.find({ advertiser_id: advertiserId }).select("_id");
        const campaignIds = campaigns.map((item) => item._id);

        const ads = await advertisementSchema.find({ campaign_id: { $in: campaignIds } });

        const data = [];

        for (const ad of ads) {
            const analytics = await analyticsSchema.find({ ad_id: ad._id });

            const summary = analytics.reduce(
                (acc, item) => {
                    acc.impressions += item.impressions;
                    acc.clicks += item.clicks;
                    acc.conversions += item.conversions;
                    return acc;
                },
                { impressions: 0, clicks: 0, conversions: 0 }
            );

            const ctr =
                summary.impressions > 0
                    ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                    : 0;

            data.push({
                ad_id: ad._id,
                ad_title: ad.ad_title,
                impressions: summary.impressions,
                clicks: summary.clicks,
                conversions: summary.conversions,
                ctr
            });
        }

        res.status(200).json({
            message: "Advertiser ad analytics fetched successfully",
            data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching advertiser ad analytics",
            error: error.message
        });
    }
};

const getAdminAdvertiserAnalytics = async (req, res) => {
    try {
        const advertisers = await userSchema.find({
            role: "advertiser",
            status: { $ne: "deleted" }
        });

        const data = [];

        for (const advertiser of advertisers) {
            const campaigns = await campaignSchema.find({ advertiser_id: advertiser._id }).select("_id");
            const campaignIds = campaigns.map((item) => item._id);

            const analytics = await analyticsSchema.find({
                campaign_id: { $in: campaignIds }
            });

            const summary = analytics.reduce(
                (acc, item) => {
                    acc.impressions += item.impressions;
                    acc.clicks += item.clicks;
                    acc.conversions += item.conversions;
                    return acc;
                },
                { impressions: 0, clicks: 0, conversions: 0 }
            );

            const ctr =
                summary.impressions > 0
                    ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                    : 0;

            data.push({
                advertiser_id: advertiser._id,
                advertiser_name: advertiser.fullName,
                impressions: summary.impressions,
                clicks: summary.clicks,
                conversions: summary.conversions,
                ctr
            });
        }

        res.status(200).json({
            message: "Admin advertiser analytics fetched successfully",
            data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching advertiser analytics",
            error: error.message
        });
    }
};

const getAdminCampaignAnalytics = async (req, res) => {
    try {
        const campaigns = await campaignSchema.find();

        const data = [];

        for (const campaign of campaigns) {
            const analytics = await analyticsSchema.find({ campaign_id: campaign._id });

            const summary = analytics.reduce(
                (acc, item) => {
                    acc.impressions += item.impressions;
                    acc.clicks += item.clicks;
                    acc.conversions += item.conversions;
                    return acc;
                },
                { impressions: 0, clicks: 0, conversions: 0 }
            );

            const ctr =
                summary.impressions > 0
                    ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                    : 0;

            data.push({
                campaign_id: campaign._id,
                campaign_name: campaign.name,
                impressions: summary.impressions,
                clicks: summary.clicks,
                conversions: summary.conversions,
                ctr
            });
        }

        res.status(200).json({
            message: "Admin campaign analytics fetched successfully",
            data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching campaign analytics",
            error: error.message
        });
    }
};

const getAdminAdAnalytics = async (req, res) => {
    try {
        const ads = await advertisementSchema.find();

        const data = [];

        for (const ad of ads) {
            const analytics = await analyticsSchema.find({ ad_id: ad._id });

            const summary = analytics.reduce(
                (acc, item) => {
                    acc.impressions += item.impressions;
                    acc.clicks += item.clicks;
                    acc.conversions += item.conversions;
                    return acc;
                },
                { impressions: 0, clicks: 0, conversions: 0 }
            );

            const ctr =
                summary.impressions > 0
                    ? ((summary.clicks / summary.impressions) * 100).toFixed(2)
                    : 0;

            data.push({
                ad_id: ad._id,
                ad_title: ad.ad_title,
                impressions: summary.impressions,
                clicks: summary.clicks,
                conversions: summary.conversions,
                ctr
            });
        }

        res.status(200).json({
            message: "Admin ad analytics fetched successfully",
            data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching ad analytics",
            error: error.message
        });
    }
};

module.exports = {
    incrementImpression,
    incrementClick,
    incrementConversion,
    getAdvertiserAnalytics,
    getCampaignAnalytics,
    getAdminAnalytics,
    getAdvertiserCampaignAnalytics,
    getAdvertiserAdAnalytics,
    getAdminAdvertiserAnalytics,
    getAdminCampaignAnalytics,
    getAdminAdAnalytics
};