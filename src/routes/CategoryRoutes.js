const router = require("express").Router()
const categoryController = require("../controllers/CategoryController")
const upload = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/category", validateToken, upload.single("image"), categoryController.createCategory);

router.get("/categories", validateToken, categoryController.getAllCategories);

router.get("/category/:id", validateToken, categoryController.getCategoryById);

router.put("/category/:id", validateToken, upload.single("image"), categoryController.updateCategory);

router.delete("/category/:id", validateToken, categoryController.deleteCategory);

module.exports = router;