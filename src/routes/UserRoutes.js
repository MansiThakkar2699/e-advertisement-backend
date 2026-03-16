const router = require("express").Router()
const userController = require("../controllers/UserController")

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/users", userController.getAllUsers)
router.get("/user/:id", userController.getUserById)
router.delete("/user/:id", userController.deleteUser)
router.put("/user/status/:id", userController.updateUserStatus)

module.exports = router