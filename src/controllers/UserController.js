const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.JWT_SECRET

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
                const token = jwt.sign(foundUserFromEmail.toObject(),secret);
                res.json({
                    message: "Login Success",
                    token:token,
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

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userSchema.find({ role: { $ne: 'admin' }, status: { $ne: 'deleted' } })
        res.json({
            message: "Users Fetched Successfully",
            data: allUsers
        })
    } catch (error) {
        res.json({
            message: "getting error while fetching users",
            error: error
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const foundUser = await userSchema.findById(req.params.id)
        if (foundUser) {
            res.json({
                message: "User Found",
                data: foundUser
            })
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        res.json({
            message: "getting error while fetching user",
            error: error
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await userSchema.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true })
        if (deletedUser) {
            res.json({
                message: "User deleted successfully",
                data: deletedUser
            })
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while deleting user",
            error: error
        })
    }
}

const updateUserStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatus = ["active", "inactive", "blocked"];

        if (!allowedStatus.includes(status)) {
            res.status(400).json({
                message: "Invalid status value"
            })
        }

        const updatedUser = await userSchema.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (updatedUser) {
            res.json({
                message: "User status updated successfully",
                data: updatedUser
            })
        }
        else {
            res.status(404).json({
                message: "User not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while updating user status",
            error: error
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserStatus
}