import type { CreateAppointmentInput, UpdateAppointmentInput } from "../schemas/appointment.schema.js"
import { prisma } from "../lib/prisma.js"
import { Appointment, DepartmentEnum, Prisma } from "../generated/prisma/index.js"

export interface AppointmentQueryFilters {
    department?: DepartmentEnum
    search?: string
    isEmergency?: boolean
}

export const getAppointments = async (filters?: AppointmentQueryFilters): Promise<Appointment[]> => {
    const { department, search, isEmergency } = filters || {}

    return await prisma.appointment.findMany({
        where: {
            ...(department && { department }),
            ...(isEmergency !== undefined && { isEmergency }),
            ...(search && {
                OR: [
                    { patientName: { contains: search, mode: 'insensitive' } },
                    { symptoms: { contains: search, mode: 'insensitive' } }
                ]
            })
        },
    })
}

export const getAppointmentById = async (id: number): Promise<Appointment | null> => {
    const appointment = await prisma.appointment.findUnique({ where: { id: id } })
    return appointment
}

export const createAppointment = async (data: CreateAppointmentInput): Promise<Appointment> => {
    const newAppointment = await prisma.appointment.create({
        data: data
    })
    return newAppointment
}

export const updateAppointment = async (id: number, data: UpdateAppointmentInput): Promise<Appointment | null> => {
    const updatedAppointment = await prisma.appointment.update({
        where: { id: id },
        data: data
    })
    return updatedAppointment

}

export const deleteAppointment = async (id: number): Promise<boolean> => {
    await prisma.appointment.delete({
        where: {
            id: id
        }
    })
    return true
}