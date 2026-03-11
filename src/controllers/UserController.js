const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtil")

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const savedUser = await userSchema.create({ ...req.body, password: hashedPassword })
        await mailSend(savedUser.email, savedUser.fullName, savedUser.role)
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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const foundUserFromEmail = await userSchema.findOne({ email: email })
        if (foundUserFromEmail) {
            const isPasswordMatched = await bcrypt.compare(password, foundUserFromEmail.password)
            if (isPasswordMatched) {
                res.json({
                    message: "Login Success",
                    data: foundUserFromEmail,
                    role: foundUserFromEmail.role
                })
            }
            else {
                res.status(401).json({
                    message: "Invalid Credencials"
                })
            }
        }
        else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        res.json({
            message: "error while logging",
            error: error
        })
    }
}

module.exports = {
    registerUser,
    loginUser
}