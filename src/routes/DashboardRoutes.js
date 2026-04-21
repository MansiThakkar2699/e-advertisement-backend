const router = require("express").Router();
const dashboardController = require("../controllers/DashboardController");

router.get("/dashboard/admin", dashboardController.getAdminDashboard);
router.get("/dashboard/advertiser/:advertiserId", dashboardController.getAdvertiserDashboard);

module.exports = router;