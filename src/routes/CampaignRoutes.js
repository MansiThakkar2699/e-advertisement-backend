const router = require("express").Router()
const campaignController = require("../controllers/CampaignController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/campaign", validateToken, campaignController.createCampaign)
router.get("/campaigns", validateToken, campaignController.getAllCampaigns)
router.get("/campaign/:id", validateToken, campaignController.getCampaignById)
router.delete("/campaign/:id", validateToken, campaignController.deleteCampaign)
router.put("/campaign/:id", validateToken, campaignController.updateCampaign)
router.get("/campaign/advertiser/:advertiser_id", validateToken, campaignController.getCampaignByAdvertiserId)
module.exports = router