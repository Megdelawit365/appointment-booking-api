import { Router } from "express"
import { register, login, refresh, logout, googleRedirect, googleCallback } from "../controllers/auth.controller.js"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
import { registerSchema, loginSchema } from "../schemas/auth.schema.js"

const router = Router()

router.post("/register", validateRequest(registerSchema), register)
router.post("/login", validateRequest(loginSchema), login)
router.post("/refresh", refresh)
router.post("/logout", requireAuth, logout)

router.get("/google", googleRedirect)
router.get("/google/callback", googleCallback)

export default router 