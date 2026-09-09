import express from "express"
const app = express()
app.use(express.json())
import appointmentRoutes from "./routes/appointment.routes.js"
import { notFound } from "./middlewares/notFound.js"
import { errorHandler } from "./middlewares/error.middleware.js"

const startTime = Date.now()

app.get("/api/health", (req, res) => {
    const currentTime = Date.now()
    return res.json({
        timestamp: new Date().toISOString(),
        uptime: (currentTime - startTime) / 1000
    })
})

app.use("/api/appointments", appointmentRoutes)
app.use(notFound)
app.use(errorHandler)

export default app