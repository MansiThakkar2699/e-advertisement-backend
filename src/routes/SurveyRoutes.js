const router = require("express").Router();
const surveyController = require("../controllers/SurveyController");

// viewer
router.get("/surveys", surveyController.getActiveSurveys);
router.get("/survey/:id", surveyController.getSurveyById);
router.post("/survey-response", surveyController.submitSurveyResponse);

// admin
router.post("/survey", surveyController.createSurvey);
router.get("/admin/surveys", surveyController.getAllSurveys);
router.put("/survey/:id", surveyController.updateSurvey);
router.delete("/survey/:id", surveyController.deleteSurvey);
router.get("/survey-responses/:surveyId", surveyController.getSurveyResponses);
router.get("/survey/advertiser/:advertiserId", surveyController.getAdvertiserSurveys);

module.exports = router;