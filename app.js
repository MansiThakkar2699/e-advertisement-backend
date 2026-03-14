const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
app.use(express.json())
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})
