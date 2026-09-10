import { Router } from "express"
import * as controller from "../controllers/appointment.controller.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
import { requirePermission } from "../middlewares/permission.middleware.js"
import { requireAppointmentOwnership } from "../middlewares/ownership.middleware.js"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { createAppointmentSchema, updateAppointmentSchema, updateStatusSchema } from "../schemas/appointment.schema.js"

const router = Router()
router.use(requireAuth)

router.post("/", requirePermission("appointments:create"), validateRequest(createAppointmentSchema), controller.create)
router.get("/", controller.getAll)
router.get("/:id", requireAppointmentOwnership(), controller.getById)
router.patch("/:id", requirePermission("appointments:update_own"), requireAppointmentOwnership(), validateRequest(updateAppointmentSchema), controller.update)
router.patch("/:id/status", requirePermission("appointments:manage_status"), validateRequest(updateStatusSchema), controller.updateStatus)
router.delete("/:id", requirePermission("appointments:delete_own"), requireAppointmentOwnership(), controller.remove)

export default router 