const router = require("express").Router()
const userController = require("../controllers/UserController")
const { uploadToDisk } = require("../middleware/UploadMiddleware")
const validateToken = require("../middleware/AuthMiddleware")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/users", validateToken, userController.getAllUsers)
router.get("/user/:id", validateToken, userController.getUserById)
router.delete("/user/:id", validateToken, userController.deleteUser)
router.put("/user/status/:id", validateToken, userController.updateUserStatus)
router.put("/user/:id", validateToken, uploadToDisk.single("profilePic"), userController.updateUser)
router.put("/change-password/:userId", validateToken, userController.changePassword);
router.post("/forgotpassword", userController.forgotPassword)
router.put("/resetpassword", userController.resetPassword)

module.exports = router