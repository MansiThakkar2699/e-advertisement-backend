const router = require("express").Router()
const advertisementController = require("../controllers/AdvertisementController")
const { uploadToMemory } = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/advertisement", validateToken, uploadToMemory.single("content"), advertisementController.createAdvertisement)
router.get("/advertisements", validateToken, advertisementController.getAllAdvertisements)
router.get("/advertisement/:id", advertisementController.getAdvertisementById)
router.delete("/advertisement/:id", validateToken, advertisementController.deleteAdvertisement)
router.put("/advertisement/:id", validateToken, uploadToMemory.single("content"), advertisementController.updateAdvertisement)
router.get("/advertisement/advertiser/:advertiserId", validateToken, advertisementController.getAdvertisementByAdvertiserId)
router.get("/advertisement/category/:category_id", validateToken, advertisementController.getAdvertisementByCategoryId)
router.post("/upload-builder-image", validateToken, uploadToMemory.single("image"), advertisementController.uploadBuilderImage);
router.put("/update-status/:id", validateToken, advertisementController.updateAdStatus)
router.get("/active-ads", advertisementController.getActiveAdvertisements)
module.exports = router