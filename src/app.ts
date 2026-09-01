import express from "express"
const app = express()
app.use(express.json())

const startTime = Date.now()

app.get("/health", (req, res) => {
    const currentTime = Date.now()
    return res.json({
        timestamp: new Date().toISOString(),
        uptime: (currentTime - startTime) / 1000
    })
})

export default app