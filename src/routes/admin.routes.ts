import { Router } from "express"
import { getMetrics } from "../controllers/admin.controller.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
import { requirePermission } from "../middlewares/permission.middleware.js"

const router = Router()

router.get("/metrics", requireAuth, requirePermission("system:admin"), getMetrics)

export default router 