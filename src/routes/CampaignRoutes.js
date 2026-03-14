const router = require("express").Router()
const campaignController = require("../controllers/CampaignController")

router.post("/campaign", campaignController.createCampaign)
router.get("/campaigns", campaignController.getAllCampaigns)
router.get("/campaign/:id", campaignController.getCampaignById)
router.delete("/campaign/:id", campaignController.deleteCampaign)
router.put("/campaign/:id", campaignController.updateCampaign)
router.put("/campaign-status/:id", campaignController.updateCampaignStatus)
router.get("/campaign/advertisement/:ad_id", campaignController.getCampaignByAdvertisementId)
module.exports = router