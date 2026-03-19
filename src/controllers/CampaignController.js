const campaignSchema = require("../models/CampaignModel")

const createCampaign = async (req, res) => {
    try {
        const campaign = await campaignSchema.create(req.body)
        res.status(201).json({
            message: "Campaign Created",
            data: campaign
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: "error while creating campaign",
            error: error
        })
    }
}

const getAllCampaigns = async (req, res) => {
    try {
        const allCampaigns = await campaignSchema.find({ status: { $ne: 'deleted' } }).populate("advertiser_id")
        res.json({
            message: "Campaign fetch successfully",
            data: allCampaigns
        })
    } catch (error) {
        res.json({
            message: "error while fetching campaigns",
            error: error
        })
    }
}

const getCampaignById = async (req, res) => {
    try {
        const foundCampaign = await campaignSchema.findById(req.params.id).populate("advertiser_id")
        if (foundCampaign) {
            res.json({
                message: "Campaign found",
                data: foundCampaign
            })
        } else {
            res.status(404).json({
                message: "Campaign not found"
            })
        }
    } catch (error) {
        res.json({
            message: "getting error while fetching campaign",
            error: error
        })
    }
}

const updateCampaign = async (req, res) => {
    try {
        const updatedCampaign = await campaignSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (updatedCampaign) {
            res.json({
                message: "Campaign Updated Successfully",
                data: updatedCampaign
            })
        } else {
            res.status(404).json({
                message: "Campaign not found"
            })
        }
    } catch (error) {
        res.json({
            message: "getting error while updating campaign",
            error: error
        })
    }
}

const deleteCampaign = async (req, res) => {
    try {
        const deletedCampaign = await campaignSchema.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true })
        if (deletedCampaign) {
            res.json({
                message: "Campaign deleted successfully",
                data: deletedCampaign
            })
        } else {
            res.status(404).json({
                message: "Campaign not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while deleting campaign",
            error: error
        })
    }
}

const getCampaignByAdvertiserId = async (req, res) => {
    try {
        const foundCampaign = await campaignSchema.find({ advertiser_id: req.params.advertiser_id, status: "active" }).populate("advertiser_id")
        if (foundCampaign) {
            res.json({
                message: "Campaign found",
                data: foundCampaign
            })
        } else {
            res.status(404).json({
                message: "Campaign not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: "getting error while fetching campaign",
            error: error
        })
    }
}

module.exports = {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    getCampaignByAdvertiserId
}