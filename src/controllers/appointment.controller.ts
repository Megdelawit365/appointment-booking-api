import type { Request, Response, NextFunction } from "express"
import type { CreateAppointmentInput, UpdateAppointmentInput } from "../schemas/appointment.schema.js"
import * as appointmentServices from "../services/appointment.service.js"


export const getAppointments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const appointments = await appointmentServices.getAppointments(req.query)
        return res.status(201).json({ data: appointments })
    } catch (error) {
        return next(error)
    }
}

export const getAppointmentById = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const appointment = await appointmentServices.getAppointmentById(Number(req.params.id))
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(201).json({ data: appointment })
    } catch (error) {
        return next(error)
    }
}

export const createAppointment = async (
    req: Request<{}, {}, CreateAppointmentInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const appointment = await appointmentServices.createAppointment(req.body)
        return res.status(201).json({ data: appointment })
    } catch (error) {
        return next(error)
    }
}

export const updateAppointment = async (
    req: Request<{ id: number }, {}, UpdateAppointmentInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const updatedAppointment = await appointmentServices.updateAppointment(req.params.id, req.body)

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(201).json({ data: updatedAppointment })
    } catch (error) {
        return next(error)
    }
}

export const deleteAppointment = async (
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const deleteAppointment = await appointmentServices.deleteAppointment(req.params.id)

        if (!deleteAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(204).send()
    } catch (error) {
        return next(error)
    }
} 