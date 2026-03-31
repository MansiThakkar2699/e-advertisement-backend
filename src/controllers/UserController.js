const userSchema = require("../models/UserModel")
const logger = require('../utils/logger');
const uploadToCloudinary = require("../utils/CloudinaryUtil")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.JWT_SECRET

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        if (req.body.role === "advertiser") {
            status = "pending";
        }
        else {
            status = "active";
        }
        const savedUser = await userSchema.create({ ...req.body, password: hashedPassword, status: status })
        await mailSend(savedUser.email, "WELCOME", {
            name: savedUser.fullName,
            role: savedUser.role
        })
        res.status(201).json({
            message: "User Created Successfully",
            data: savedUser
        })
    } catch (error) {
        logger.error("error while creating user", error)
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
        if (!foundUserFromEmail) {
            logger.error("User not found")
            return res.status(404).json({
                message: "User not found"
            });
        }

        // check status first
        if (foundUserFromEmail.status === "deleted") {
            logger.error("Your account does not exist")
            return res.status(404).json({
                message: "Your account does not exist"
            });
        }

        if (foundUserFromEmail.status === "pending") {
            logger.error("Your account is waiting for admin approval")
            return res.status(403).json({
                message: "Your account is waiting for admin approval"
            });
        }

        if (foundUserFromEmail.status === "blocked") {
            logger.error("Your account is blocked")
            return res.status(403).json({
                message: "Your account is blocked"
            });
        }

        if (foundUserFromEmail.status === "rejected") {
            logger.error("Your account is rejected")
            return res.status(403).json({
                message: "Your account is rejected"
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, foundUserFromEmail.password)

        if (!isPasswordMatched) {
            logger.error("Invalid Credentials")
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        // generate token
        const token = jwt.sign(
            { id: foundUserFromEmail._id },
            secret,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login Success",
            token: token,
            role: foundUserFromEmail.role
        });

    } catch (error) {
        logger.error("error while logging", error)
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
        logger.error("getting error while fetching users", error)
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
            logger.error("User not found")
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        logger.error("getting error while fetching user", error)
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
            logger.error("User not found")
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        logger.error("getting error while deleting user", error)
        res.json({
            message: "getting error while deleting user",
            error: error
        })
    }
}

const updateUserStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatus = ["active", "pending", "blocked", "rejected"];

        if (!allowedStatus.includes(status)) {
            logger.error("Invalid status value")
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
            logger.error("User not found")
            res.status(404).json({
                message: "User not found"
            });
        }
    } catch (error) {
        logger.error("Error while updating user status", error)
        res.status(500).json({
            message: "Error while updating user status",
            error: error
        })
    }
}

const updateUser = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file && req.file.path) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryResponse.secure_url;
        }
        const updatedUser = await userSchema.findByIdAndUpdate(req.params.id, { ...req.body, ...(imageUrl && { profilePic: imageUrl }) }, { new: true })
        if (updatedUser) {
            res.json({
                message: "User Updated Successfully",
                data: updatedUser
            })
        } else {
            logger.error("User not found")
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (error) {
        logger.error("getting error while updating user", error)
        res.json({
            message: "getting error while updating user",
            error: error
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;

        // 1. Find user by ID
        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Verify Old Password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // 3. Hash the New Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update Database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        logger.error("Change Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({
        messsage: "email is not provided."
    })

    const foundUserFromEmail = await userSchema.findOne({ email: email })
    if (foundUserFromEmail) {
        //token generate..
        const token = jwt.sign(foundUserFromEmail.toObject(), secret, { expiresIn: 60 * 24 * 7 })
        //reset link..
        const url = `http://localhost:5173/resetpassword/${token}`


        await mailSend(foundUserFromEmail.email, "RESET_PASSWORD", {
            name: foundUserFromEmail.fullName,
            resetLink: url
        });

        res.status(200).json({
            message: "reset link has been sent to your email"
        })
    }
    else {
        res.status(404).json({
            message: "user not found.."
        })
    }
}

const resetPassword = async (req, res) => {
    const { newPassword, token } = req.body;
    try {
        const decodedUser = await jwt.verify(token, secret) //{userobject}
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUser = await userSchema.findByIdAndUpdate(decodedUser._id, { password: hashedPassword })
        res.status(200).json({
            message: "password reset successfully !!",
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "server error..",
            err: err
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword
}