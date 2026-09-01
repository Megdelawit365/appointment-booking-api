import { Router } from "express"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { createAppointmentSchema, updateAppointmentSchema, } from "../schemas/appointment.schema.js"
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, } from "../controllers/appointment.controller.js"

const router = Router()
router.get("/appointments", getAppointments)
router.get("/appointments/:id", getAppointmentById)
router.post("/appointments", validateRequest(createAppointmentSchema), createAppointment)
router.patch("/appointments/:id", validateRequest(updateAppointmentSchema), updateAppointment)
router.delete("/appointments/:id", deleteAppointment)

export default router 