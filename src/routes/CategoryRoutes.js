const router = require("express").Router()
const categoryController = require("../controllers/CategoryController")
const upload = require("../middleware/UploadMiddleware")

router.post("/category", upload.single("image"), categoryController.createCategory);

router.get("/categories", categoryController.getAllCategories);

router.get("/category/:id", categoryController.getCategoryById);

router.put("/category/:id", upload.single("image"), categoryController.updateCategory);

router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;