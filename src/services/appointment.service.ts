import { prisma } from "../lib/prisma.js"
import { Department, AppointmentStatus } from "../generated/prisma/index.js"

type User = { userId: string; role: string; permissions: string[] }

export async function createAppointment(
    user: User,
    data: {
        department: Department
        appointmentDate: string
        symptoms: string
        isEmergency: boolean
    }
) {
    if (!user.permissions.includes("appointments:create")) {
        throw { status: 403, message: "Forbidden" }
    }

    const bookingDate = new Date(data.appointmentDate)

    const existingBooking = await prisma.appointment.findFirst({
        where: {
            department: data.department,
            appointmentDate: bookingDate,
            status: { in: ["PENDING", "CONFIRMED"] },
        },
    })

    if (existingBooking) {
        throw { status: 409, message: "Booking date conflict" }
    }

    return prisma.appointment.create({
        data: {
            patientId: user.userId,
            department: data.department,
            appointmentDate: bookingDate,
            symptoms: data.symptoms,
            isEmergency: data.isEmergency,
        },
    })
}

export async function getAppointments(user: User, filters: any) {
    const canReadOwn = user.permissions.includes("appointments:read_own")
    const canReadAll = user.permissions.includes("appointments:read_all")

    if (!canReadOwn && !canReadAll) {
        throw { status: 403, message: "Forbidden" }
    }

    const isPatient = user.role === "PATIENT" && !canReadAll

    return prisma.appointment.findMany({
        where: {
            ...(isPatient && { patientId: user.userId }),
            ...(filters.department && { department: filters.department }),
            ...(filters.isEmergency !== undefined && { isEmergency: filters.isEmergency }),
            ...(filters.search && {
                OR: [
                    { patientName: { contains: filters.search, mode: 'insensitive' } },
                    { symptoms: { contains: filters.search, mode: 'insensitive' } }
                ]
            })
        }
    })
}

export async function getAppointmentById(user: User, id: string) {
    const canReadOwn = user.permissions.includes("appointments:read_own")
    const canReadAll = user.permissions.includes("appointments:read_all")

    if (!canReadOwn && !canReadAll) {
        throw { status: 403, message: "Forbidden" }
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) throw { status: 404, message: "Appointment not found" }

    const isOwner = appointment.patientId === user.userId
    if (!isOwner && !canReadAll) {
        throw { status: 403, message: "Forbidden" }
    }

    return appointment
}

export async function updateAppointment(
    user: User,
    id: string,
    data: {
        appointmentDate?: string,
        symptoms?: string,

    }
) {
    if (!user.permissions.includes("appointments:update:own")) {
        throw { status: 403, message: "Forbidden" }
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) throw { status: 404, message: "Appointment not found" }

    if (appointment.patientId !== user.userId) {
        throw { status: 403, message: "Forbidden" }
    }

    if (appointment.status !== "PENDING") {
        throw { status: 400, message: "Only PENDING appointments can be updated" }
    }

    return prisma.appointment.update({
        where: { id },
        data: {
            appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : appointment.appointmentDate,
            symptoms: data.symptoms,
        },
    })
}

export async function updateAppointmentStatus(
    user: User,
    id: string,
    status: AppointmentStatus,
    notes?: string
) {
    const hasPermission = user.permissions.includes("appointments:manage_status")
    const isAuthorizedRole = user.role === "DOCTOR" || user.role === "ADMIN"

    if (!hasPermission || !isAuthorizedRole) {
        throw { status: 403, message: "Forbidden" }
    }

    return prisma.appointment.update({
        where: { id },
        data: { status: status, notes: notes },
    })
}

export async function cancelAppointment(user: User, id: string) {
    if (!user.permissions.includes("appointments:delete:own")) {
        throw { status: 403, message: "Forbidden" }
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) throw { status: 404, message: "Appointment not found" }

    if (appointment.patientId !== user.userId) {
        throw { status: 403, message: "Forbidden" }
    }

    if (appointment.status !== "PENDING") {
        throw { status: 400, message: "Only PENDING appointments can be cancelled" }
    }

    return prisma.appointment.update({
        where: { id },
        data: { status: "CANCELLED" },
    })
}