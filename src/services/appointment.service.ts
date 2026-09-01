import type { CreateAppointmentInput, UpdateAppointmentInput } from "../schemas/appointment.schema.js"

interface Appointment extends CreateAppointmentInput {
    id: number
}

const appointments: Appointment[] = []
let id = 1

export interface AppointmentQueryFilters {
    department?: string
    search?: string
    isEmergency?: boolean
}

export const getAppointmentsService = async (filters?: AppointmentQueryFilters): Promise<Appointment[]> => {
    if (!filters || Object.keys(filters).length === 0) {
        return appointments
    }

    return appointments.filter((app) => {
        let match = true

        if (filters.department) {
            match = match && app.department === filters.department
        }

        if (filters.search) {
            match = match && (app.patientName.toLowerCase().includes(filters.search.toLowerCase())
                || app.symptoms.toLowerCase().includes(filters.search.toLowerCase()))
        }

        if (filters.isEmergency !== undefined) {
            match = match && app.isEmergency === filters.isEmergency
        }

        return match
    })
}

export const getAppointmentById = async (id: number): Promise<Appointment | null> => {
    const appointment = appointments.find((a) => a.id === id)
    return appointment || null
}

export const createAppointment = async (data: CreateAppointmentInput): Promise<Appointment> => {
    const newAppointment: Appointment = {
        id: id,
        appointmentDate: data.appointmentDate,
        patientEmail: data.patientEmail,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        department: data.department,
        isEmergency: data.isEmergency,
        symptoms: data.symptoms
    }
    id += 1
    appointments.push(newAppointment)
    return newAppointment
}

export const updateAppointment = async (id: number, data: UpdateAppointmentInput): Promise<Appointment | null> => {
    const index = appointments.findIndex((a) => a.id === id)
    if (index === -1) {
        return null
    }

    // keeps all existing fields and  re writes only the ones passed in data
    const updatedAppointment: Appointment = {
        ...appointments[index],
        ...data,
    }

    appointments[index] = updatedAppointment
    return updatedAppointment
}

export const deleteAppointment = async (id: number): Promise<boolean> => {
    const index = appointments.findIndex((a) => a.id === id)
    if (index === -1) {
        return false
    }
    appointments.splice(index, 1)
    return true
}