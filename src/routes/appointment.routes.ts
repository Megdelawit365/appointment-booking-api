import { Router } from "express"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { createAppointmentSchema, updateAppointmentSchema, } from "../schemas/appointment.schema.js"
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from "../controllers/appointment.controller.js"

const router = Router()
router.get("/", getAppointments)
router.get("/:id", getAppointmentById)
router.post("", validateRequest(createAppointmentSchema), createAppointment)
router.patch("/:id", validateRequest(updateAppointmentSchema), updateAppointment)
router.delete("/:id", deleteAppointment)

export default router 