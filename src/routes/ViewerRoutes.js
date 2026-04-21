const router = require("express").Router();
const viewerController = require("../controllers/ViewerController");

router.get("/home-stats", viewerController.getHomeStats);

module.exports = router;