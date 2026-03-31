const router = require("express").Router()
const advertisementController = require("../controllers/AdvertisementController")
const upload = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/advertisement", validateToken, upload.single("content"), advertisementController.createAdvertisement)
router.get("/advertisements", validateToken, advertisementController.getAllAdvertisements)
router.get("/advertisement/:id", validateToken, advertisementController.getAdvertisementById)
router.delete("/advertisement/:id", validateToken, advertisementController.deleteAdvertisement)
router.put("/advertisement/:id", validateToken, upload.single("content"), advertisementController.updateAdvertisement)
router.get("/advertisement/campaign/:campaign_id", validateToken, advertisementController.getAdvertisementByCampaignId)
router.get("/advertisement/category/:category_id", validateToken, advertisementController.getAdvertisementByCategoryId)
module.exports = router