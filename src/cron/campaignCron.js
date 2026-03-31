const cron = require("node-cron")
const Campaign = require("../models/CampaignModel")

cron.schedule("0 0 * * *", async () => {
    try {

        const today = new Date();

        const result = await Campaign.updateMany(
            { end_date: { $lt: today }, status: "active" },
            { $set: { status: "completed" } }
        );

        console.log("Campaign cron executed:", result.modifiedCount);

    } catch (error) {
        console.log("Cron error:", error);
    }
});