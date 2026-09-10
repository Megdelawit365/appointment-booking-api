import { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma.js"

export async function getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
        const patientRole = await prisma.role.findUnique({ where: { name: "PATIENT" } })
        const totalPatients = await prisma.user.count({ where: { roleId: patientRole?.id } })

        const bookingsPerDepartment = await prisma.appointment.groupBy({
            by: ["department"],
            _count: { id: true },
        })

        return res.json({ totalPatients, bookingsPerDepartment })
    } catch (error) {
        next(error)
    }
}