const router = require("express").Router()
const advertisementController = require("../controllers/AdvertisementController")

router.post("/advertisement", advertisementController.createAdvertisement)
router.get("/advertisements", advertisementController.getAllAdvertisements)
router.get("/advertisement/:id", advertisementController.getAdvertisementById)
router.delete("/advertisement/:id", advertisementController.deleteAdvertisement)
router.put("/advertisement/:id", advertisementController.updateAdvertisement)
router.get("/advertisement/campaign/:campaign_id", advertisementController.getAdvertisementByCampaignId)
router.get("/advertisement/category/:category_id", advertisementController.getAdvertisementByCategoryId)
module.exports = router