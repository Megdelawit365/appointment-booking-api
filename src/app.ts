import express from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import appointmentRoutes from "./routes/appointment.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js"

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/admin", adminRoutes)
app.use(errorHandler)

export default app 