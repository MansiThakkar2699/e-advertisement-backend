const router = require("express").Router()
const advertisementController = require("../controllers/AdvertisementController")

router.post("/advertisement", advertisementController.createAdvertisement)
router.get("/advertisements", advertisementController.getAllAdvertisements)
router.get("/advertisement/:id", advertisementController.getAdvertisementById)
router.delete("/advertisement/:id", advertisementController.deleteAdvertisement)
router.put("/advertisement/:id", advertisementController.updateAdvertisement)
router.put("/advertisement-status/:id", advertisementController.updateAdvertisementStatus)
router.get("/advertisement/advertiser/:advertiser_id", advertisementController.getAdvertisementByAdvertiserId)
module.exports = router