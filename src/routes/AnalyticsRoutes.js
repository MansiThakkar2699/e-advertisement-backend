const router = require("express").Router()
const analyticsController = require("../controllers/AnalyticsController")

router.post("/analytics", analyticsController.createAnalytics);
router.get("/analytics", analyticsController.getAllAnalytics);
router.get("/analytics/campaign/:campaign_id", analyticsController.getCampaignAnalytics);
router.put("/analytics/impression/:campaign_id", analyticsController.updateImpression);
router.put("/analytics/click/:campaign_id", analyticsController.updateClicks);
router.put("/analytics/conversion/:campaign_id", analyticsController.updateConversions);

module.exports = router