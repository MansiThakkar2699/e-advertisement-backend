const express = require("express")
require("./src/cron/campaignCron");
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.use(cors())

const DBConnection = require("./src/utils/DBConnection")
DBConnection()

const userRoutes = require("./src/routes/UserRoutes")
app.use("/user", userRoutes)

const advertisementRoutes = require("./src/routes/AdvertisementRoutes")
app.use("/ads", advertisementRoutes)

const campaignRoutes = require("./src/routes/CampaignRoutes")
app.use("/campaign", campaignRoutes)

const feedbackRoutes = require("./src/routes/FeedbackRoutes")
app.use("/feedback", feedbackRoutes)

const analyticsRoutes = require("./src/routes/AnalyticsRoutes")
app.use("/analytics", analyticsRoutes)

const categoryRoutes = require("./src/routes/CategoryRoutes")
app.use("/category", categoryRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
