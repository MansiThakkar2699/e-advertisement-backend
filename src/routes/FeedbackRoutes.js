const router = require("express").Router()
const feedbackController = require("../controllers/FeedbackController")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/feedback", validateToken, feedbackController.createFeedback);
router.get("/feedback", validateToken, feedbackController.getAllFeedback);
router.put("/feedback/:id", validateToken, feedbackController.updateFeedback);
router.get("/feedback/advertisement/:advertisement_id", validateToken, feedbackController.getFeedbackByAdvertisement);
router.get("/feedback/viewer/:viewer_id", validateToken, feedbackController.getFeedbackByViewer);
module.exports = router