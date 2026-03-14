const advertisementSchema = require("../models/AdvertisementModel")

const createAdvertisement = async (req, res) => {
    try {
        const advertisement = await advertisementSchema.create(req.body)
        res.status(201).json({
            message: "Advertisement Created",
            data: advertisement
        })

    } catch (error) {
        res.json({
            message: "error while creating advertisement",
            error: error
        })
    }
}

const getAllAdvertisements = async (req, res) => {
    try {
        const allAdvertisements = await advertisementSchema.find({ status: "active" }).populate("advertiser_id")
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
        const foundAdvertisement = await advertisementSchema.findById(req.params.id).populate("advertiser_id")
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
        const updatedAdvertisement = await advertisementSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

const updateAdvertisementStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatus = ["active", "inactive", "blocked", "paused"];

        if (!allowedStatus.includes(status)) {
            res.status(400).json({
                message: "Invalid status value"
            })
        }

        const updatedAdvertisement = await advertisementSchema.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (updatedAdvertisement) {
            res.json({
                message: "Advertisement status updated successfully",
                data: updatedAdvertisement
            })
        }
        else {
            res.status(404).json({
                message: "Advertisement not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while updating advertisement status",
            error: error
        })
    }
}

const getAdvertisementByAdvertiserId = async (req, res) => {
    try {
        const foundAdvertisement = await advertisementSchema.find({ advertiser_id: req.params.advertiser_id, status: "active" }).populate("advertiser_id")
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
    updateAdvertisementStatus,
    getAdvertisementByAdvertiserId
}