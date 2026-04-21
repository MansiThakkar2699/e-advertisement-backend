const router = require("express").Router();
const contactController = require("../controllers/ContactController");
const validateToken = require("../middleware/AuthMiddleware")

// viewer side
router.post("/contact", contactController.createContactMessage);

// admin side
router.get("/contacts", validateToken, contactController.getAllContactMessages);
router.get("/contact/:id", validateToken, contactController.getContactMessageById);
router.put("/contact/status/:id", validateToken, contactController.updateContactMessageStatus);
router.delete("/contact/:id", validateToken, contactController.deleteContactMessage);

module.exports = router;