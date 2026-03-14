const router = require("express").Router()
const feedbackController = require("../controllers/FeedbackController")
router.post("/feedback", feedbackController.createFeedback);
router.get("/feedback", feedbackController.getAllFeedback);
router.put("/feedback/:id", feedbackController.updateFeedback);
router.get("/feedback/advertisement/:advertisement_id", feedbackController.getFeedbackByAdvertisement);
router.get("/feedback/viewer/:viewer_id", feedbackController.getFeedbackByViewer);
module.exports = router