const router = require("express").Router()
const categoryController = require("../controllers/CategoryController")
const { uploadToDisk } = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/category", validateToken, uploadToDisk.single("image"), categoryController.createCategory);

router.get("/categories", validateToken, categoryController.getAllCategories);

router.get("/category/:id", validateToken, categoryController.getCategoryById);

router.put("/category/:id", validateToken, uploadToDisk.single("image"), categoryController.updateCategory);

router.delete("/category/:id", validateToken, categoryController.deleteCategory);

router.get("/active-category", categoryController.getActiveCategories);

module.exports = router;