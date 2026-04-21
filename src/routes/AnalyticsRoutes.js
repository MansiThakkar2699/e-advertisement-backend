const router = require("express").Router();
const analyticsController = require("../controllers/AnalyticsController");

router.post("/analytics/impression/:adId", analyticsController.incrementImpression);
router.post("/analytics/click/:adId", analyticsController.incrementClick);
router.post("/analytics/conversion/:adId", analyticsController.incrementConversion);

router.get("/analytics/advertiser/:advertiserId", analyticsController.getAdvertiserAnalytics);
router.get("/analytics/campaign/:campaignId", analyticsController.getCampaignAnalytics);
router.get("/analytics/admin", analyticsController.getAdminAnalytics);
router.get("/analytics/advertiser-campaigns/:advertiserId", analyticsController.getAdvertiserCampaignAnalytics);
router.get("/analytics/advertiser-ads/:advertiserId", analyticsController.getAdvertiserAdAnalytics);

router.get("/analytics/admin/advertisers", analyticsController.getAdminAdvertiserAnalytics);
router.get("/analytics/admin/campaigns", analyticsController.getAdminCampaignAnalytics);
router.get("/analytics/admin/ads", analyticsController.getAdminAdAnalytics);

module.exports = router;