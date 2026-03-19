const router = require("express").Router()
const campaignController = require("../controllers/CampaignController")

router.post("/campaign", campaignController.createCampaign)
router.get("/campaigns", campaignController.getAllCampaigns)
router.get("/campaign/:id", campaignController.getCampaignById)
router.delete("/campaign/:id", campaignController.deleteCampaign)
router.put("/campaign/:id", campaignController.updateCampaign)
router.get("/campaign/advertiser/:advertiser_id", campaignController.getCampaignByAdvertiserId)
module.exports = router