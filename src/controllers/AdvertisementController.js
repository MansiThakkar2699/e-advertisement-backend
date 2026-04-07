const advertisementSchema = require("../models/AdvertisementModel");
const categorySchema = require("../models/CategoryModel");
const { uploadFromBuffer } = require("../utils/CloudinaryUtil")
const logger = require('../utils/logger');
const mongoose = require("mongoose")

const makeSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const getOrCreateCategoryId = async (category_id, custom_category) => {
    if (category_id && category_id.trim() !== "") {
        return category_id;
    }

    if (!custom_category || !custom_category.trim()) {
        return null;
    }

    const name = custom_category.trim();
    const baseSlug = makeSlug(name);
    let slug = baseSlug;

    let existingCategory = await categorySchema.findOne({ slug });
    if (existingCategory) {
        return existingCategory._id;
    }

    let counter = 1;
    while (await categorySchema.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    const newCategory = await categorySchema.create({
        name,
        slug
    });

    return newCategory._id;
};

const createAdvertisement = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file && req.file.buffer) {
            const cloudinaryResponse = await uploadFromBuffer(req.file.buffer);
            imageUrl = cloudinaryResponse.secure_url;
        }

        if (!imageUrl) {
            return res.status(400).json({
                message: "Advertisement image is required"
            });
        }

        const payload = {
            ...req.body,
            content: imageUrl
        };

        if (req.body.design_json) {
            payload.design_json = JSON.parse(req.body.design_json);
        }

        const finalCategoryId = await getOrCreateCategoryId(
            req.body.category_id,
            req.body.custom_category
        );

        if (!finalCategoryId) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        payload.category_id = finalCategoryId;
        payload.custom_category = "";

        const advertisement = await advertisementSchema.create(payload);

        res.status(201).json({
            message: "Advertisement Created",
            data: advertisement
        })

    } catch (error) {
        logger.error('error while creating advertisement', error);
        res.json({
            message: "error while creating advertisement",
            error: error
        })
    }
}

const getAllAdvertisements = async (req, res) => {
    try {
        // Wrap the path and nested populate in a single object {}
        const allAdvertisements = await advertisementSchema.find({ status: { $ne: 'deleted' } })
            .populate({
                path: 'campaign_id',
                populate: {
                    path: 'advertiser_id',
                    model: 'users',
                }
            })
            .populate("category_id");

        res.json({
            message: "Advertisements fetched successfully",
            data: allAdvertisements
        });
    } catch (error) {
        logger.error('Error while fetching advertisements', error)
        res.status(500).json({
            message: "Error while fetching advertisements",
            error: error.message
        });
    }
}

const getAdvertisementById = async (req, res) => {
    try {
        const foundAdvertisement = await advertisementSchema.findById(req.params.id)
            .populate({
                path: 'campaign_id',
                populate: {
                    path: 'advertiser_id',
                    model: 'users',
                }
            })
            .populate("category_id")
        if (foundAdvertisement) {
            res.json({
                message: "Advertisement found",
                data: foundAdvertisement
            })
        } else {
            logger.error("Advertisement not found");
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        logger.error("getting error while fetching advertisement", error);
        res.json({
            message: "getting error while fetching advertisement",
            error: error
        })
    }
}

const updateAdvertisement = async (req, res) => {
    try {
        let imageUrl = null;

        // 1. Upload new image if provided
        if (req.file && req.file.buffer) {
            const cloudinaryResponse = await uploadFromBuffer(req.file.buffer);
            imageUrl = cloudinaryResponse.secure_url;
        }

        // 2. Prepare payload
        const payload = {
            ...req.body
        };

        // 3. Replace content only if new image uploaded
        if (imageUrl) {
            payload.content = imageUrl;
        }

        // 4. Parse design_json (IMPORTANT)
        if (req.body.design_json) {
            payload.design_json = JSON.parse(req.body.design_json);
        }

        const finalCategoryId = await getOrCreateCategoryId(
            req.body.category_id,
            req.body.custom_category
        );

        if (!finalCategoryId) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        payload.category_id = finalCategoryId;
        payload.custom_category = "";

        // 5. Update DB
        const updatedAdvertisement = await advertisementSchema.findByIdAndUpdate(
            req.params.id,
            payload,
            { new: true }
        );

        if (!updatedAdvertisement) {
            return res.status(404).json({
                message: "Advertisement not found"
            });
        }

        res.status(200).json({
            message: "Advertisement Updated Successfully",
            data: updatedAdvertisement
        });

    } catch (error) {
        logger.error("getting error while updating advertisement", error);

        res.status(500).json({
            message: "getting error while updating advertisement",
            error: error.message
        });
    }
};

const deleteAdvertisement = async (req, res) => {
    try {
        const deletedAdvertisement = await advertisementSchema.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true })
        if (deletedAdvertisement) {
            res.json({
                message: "Advertisement deleted successfully",
                data: deletedAdvertisement
            })
        } else {
            logger.error("Advertisement not found")
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        logger.error("getting error while deleting advertisement", error)
        res.json({
            message: "getting error while deleting advertisement",
            error: error
        })
    }
}

const getAdvertisementByAdvertiserId = async (req, res) => {
    try {
        const { advertiserId } = req.params;

        const advertisements = await advertisementSchema.aggregate([
            // 1. Join with Campaigns
            {
                $lookup: {
                    from: "campaigns",
                    localField: "campaign_id",
                    foreignField: "_id",
                    as: "campaign_details"
                }
            },
            { $unwind: "$campaign_details" },

            // 2. Filter by the Advertiser ID inside the campaign
            {
                $match: {
                    "campaign_details.advertiser_id": new mongoose.Types.ObjectId(advertiserId)
                }
            },

            // 3. Nested Lookup: Join campaign_details.advertiser_id with 'users'
            {
                $lookup: {
                    from: "users", // Your collection name for users
                    localField: "campaign_details.advertiser_id",
                    foreignField: "_id",
                    as: "campaign_details.advertiser_id"
                }
            },
            { $unwind: "$campaign_details.advertiser_id" },

            // 4. Join with Categories
            {
                $lookup: {
                    from: "categories", // Your collection name for categories
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category_id"
                }
            },
            // Using unwind with preserveNullAndEmptyArrays in case an ad has no category
            { $unwind: { path: "$category_id", preserveNullAndEmptyArrays: true } }
        ]);

        res.status(200).json({
            message: "Advertisements fetched successfully",
            data: advertisements
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Error fetching advertisements",
            error: error.message
        });
    }
};

const getAdvertisementByCategoryId = async (req, res) => {
    try {
        const foundAdvertisement = await advertisementSchema.find({ category_id: req.params.category_id, status: "active" })
            .populate({
                path: 'campaign_id',
                populate: {
                    path: 'advertiser_id',
                    model: 'users',
                }
            })
            .populate("category_id")
        if (foundAdvertisement) {
            res.json({
                message: "Advertisement found",
                data: foundAdvertisement
            })
        } else {
            logger.error("Advertisement not found")
            res.status(404).json({
                message: "Advertisement not found"
            })
        }
    } catch (error) {
        logger.error("getting error while fetching advertisement", error)
        res.json({
            message: "getting error while fetching advertisement",
            error: error
        })
    }
}

const uploadBuilderImage = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                message: "Image file is required"
            });
        }

        const cloudinaryResponse = await uploadFromBuffer(req.file.buffer);

        return res.status(200).json({
            message: "Builder image uploaded successfully",
            data: {
                secure_url: cloudinaryResponse.secure_url
            }
        });
    } catch (error) {
        logger.error("uploadBuilderImage error:", error);
        return res.status(500).json({
            message: "Error while uploading builder image",
            error: error.message
        });
    }
};

module.exports = {
    createAdvertisement,
    getAllAdvertisements,
    getAdvertisementById,
    updateAdvertisement,
    deleteAdvertisement,
    getAdvertisementByAdvertiserId,
    getAdvertisementByCategoryId,
    uploadBuilderImage
}