const advertisementSchema = require("../models/AdvertisementModel");
const { countDocuments } = require("../models/CategoryModel");
const uploadToCloudinary = require("../utils/CloudinaryUtil")

const createAdvertisement = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file && req.file.path) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryResponse.secure_url;
        }
        const advertisement = await advertisementSchema.create({
            ...req.body,
            ...(imageUrl && { content: imageUrl })
        })
        res.status(201).json({
            message: "Advertisement Created",
            data: advertisement
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: "error while creating advertisement",
            error: error
        })
    }
}

const getAllAdvertisements = async (req, res) => {
    try {
        const allAdvertisements = await advertisementSchema.find({ status: { $ne: 'deleted' } }).populate("campaign_id").populate("category_id")
        res.json({
            message: "Advertisements fetch successfully",
            data: allAdvertisements
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "error while fetching advertisements",
            error: error
        })
    }
}

const getAdvertisementById = async (req, res) => {
    try {
        const foundAdvertisement = await advertisementSchema.findById(req.params.id).populate("campaign_id").populate("category_id")
        if (foundAdvertisement) {
            res.json({
                message: "Advertisement found",
                data: foundAdvertisement
            })
        } else {
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        res.json({
            message: "getting error while fetching advertisement",
            error: error
        })
    }
}

const updateAdvertisement = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file && req.file.path) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.path);
            imageUrl = cloudinaryResponse.secure_url;
        }
        const updatedAdvertisement = await advertisementSchema.findByIdAndUpdate(req.params.id, { ...req.body, ...(imageUrl && { content: imageUrl }) }, { new: true })
        if (updatedAdvertisement) {
            res.json({
                message: "Advertisement Updated Successfully",
                data: updatedAdvertisement
            })
        } else {
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while updating advertisement",
            error: error
        })
    }
}

const deleteAdvertisement = async (req, res) => {
    try {
        const deletedAdvertisement = await advertisementSchema.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true })
        if (deletedAdvertisement) {
            res.json({
                message: "Advertisement deleted successfully",
                data: deletedAdvertisement
            })
        } else {
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while deleting advertisement",
            error: error
        })
    }
}

const getAdvertisementByCampaignId = async (req, res) => {
    try {
        const foundAdvertisement = await advertisementSchema.find({ campaign_id: req.params.campaign_id, status: "active" }).populate("campaign_id").populate("category_id")
        if (foundAdvertisement) {
            res.json({
                message: "Advertisement found",
                data: foundAdvertisement
            })
        } else {
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while fetching advertisement",
            error: error
        })
    }
}

const getAdvertisementByCategoryId = async (req, res) => {
    try {
        const foundAdvertisement = await advertisementSchema.find({ category_id: req.params.category_id, status: "active" }).populate("campaign_id").populate("category_id")
        if (foundAdvertisement) {
            res.json({
                message: "Advertisement found",
                data: foundAdvertisement
            })
        } else {
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while fetching advertisement",
            error: error
        })
    }
}

module.exports = {
    createAdvertisement,
    getAllAdvertisements,
    getAdvertisementById,
    updateAdvertisement,
    deleteAdvertisement,
    getAdvertisementByCampaignId,
    getAdvertisementByCategoryId
}