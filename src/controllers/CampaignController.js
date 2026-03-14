const campaignSchema = require("../models/CampaignModel")

const createCampaign = async (req, res) => {
    try {
        const campaign = await campaignSchema.create(req.body)
        res.status(201).json({
            message: "Campaign Created",
            data: campaign
        })

    } catch (error) {
        res.json({
            message: "error while creating campaign",
            error: error
        })
    }
}

const getAllCampaigns = async (req, res) => {
    try {
        const allCampaigns = await campaignSchema.find({ status: "active" }).populate("ad_id")
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
        const foundCampaign = await campaignSchema.findById(req.params.id).populate("ad_id")
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

const updateCampaignStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatus = ["active", "inactive", "blocked"];

        if (!allowedStatus.includes(status)) {
            res.status(400).json({
                message: "Invalid status value"
            })
        }

        const updatedCampaign = await campaignSchema.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (updatedCampaign) {
            res.json({
                message: "Campaign status updated successfully",
                data: updatedCampaign
            })
        }
        else {
            res.status(404).json({
                message: "Campaign not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while updating campaign status",
            error: error
        })
    }
}

const getCampaignByAdvertisementId = async (req, res) => {
    try {
        const foundCampaign = await campaignSchema.find({ ad_id: req.params.ad_id, status: "active" }).populate("ad_id")
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
    updateCampaignStatus,
    getCampaignByAdvertisementId
}