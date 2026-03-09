const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const savedUser = await userSchema.create({ ...req.body, password: hashedPassword })
        res.status(201).json({
            message: "User Created Successfully",
            data: savedUser
        })
    } catch (error) {
        res.json({
            message: "error while creating user",
            error: error
        })
    }
}

module.exports = {
    registerUser
}