import { Request, Response, NextFunction } from "express"
import * as appointmentService from "../services/appointment.service.js"
import { prisma } from "../lib/prisma.js"

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw { status: 401, message: "Authentication required" }
        }
        const appointment = await appointmentService.createAppointment(req.user, req.body)
        return res.status(201).json(appointment)
    } catch (error) {
        next(error)
    }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const appointments = await appointmentService.getAppointments(req.user!, req.query)
        return res.json(appointments)
    } catch (error) {
        next(error)
    }
}

export async function getById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id }
        })
        return res.json(appointment)
    } catch (error) {
        next(error)
    }
}

export async function update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw { status: 401, message: "Authentication required" }
        }
        const updated = await appointmentService.updateAppointment(req.user, req.params.id, req.body)
        return res.json(updated)
    } catch (error) {
        next(error)
    }
}

export async function updateStatus(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw { status: 401, message: "Authentication required" }
        }
        const { status, notes } = req.body
        const updated = await appointmentService.updateAppointmentStatus(req.user, req.params.id, status, notes)
        return res.json(updated)
    } catch (error) {
        next(error)
    }
}

export async function remove(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw { status: 401, message: "Authentication required" }
        }
        const cancelled = await appointmentService.cancelAppointment(req.user, req.params.id)
        return res.json(cancelled)
    } catch (error) {
        next(error)
    }
}