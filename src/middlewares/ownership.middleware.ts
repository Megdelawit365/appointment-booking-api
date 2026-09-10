import { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma.js"

export const requireAppointmentOwnership = () => {
    return async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const user = req.user

            if (!user) {
                return res.status(401).json({ message: "Authentication required" })
            }

            const appointment = await prisma.appointment.findUnique({
                where: { id: id },
                select: { id: true, patientId: true, status: true },
            })

            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found" })
            }

            const isOwner = appointment.patientId === user.userId
            const hasOverride =
                user.permissions.includes("appointments:read:all") || user.role === "ADMIN"

            if (!isOwner && !hasOverride) {
                return res.status(403).json({
                    message:
                        "Forbidden",
                })
            }

            next()
        } catch (error) {
            next(error)
        }
    }
} 