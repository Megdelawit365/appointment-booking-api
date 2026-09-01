import type { CreateAppointmentInput, UpdateAppointmentInput } from "../schemas/appointment.schema.js";

interface Appointment extends CreateAppointmentInput {
    id: number;
}

const appointments: Appointment[] = [];
let id = 1

export const createAppointmentService = async (data: CreateAppointmentInput): Promise<Appointment> => {
    const newAppointment: Appointment = {
        id: id,
        appointmentDate: data.appointmentDate,
        patientEmail: data.patientEmail,
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        department: data.department,
        isEmergency: data.isEmergency,
        symptoms: data.symptoms
    };
    id += 1
    appointments.push(newAppointment);
    return newAppointment;
};

export const updateAppointmentService = async (id: number, data: UpdateAppointmentInput): Promise<Appointment | null> => {
    const index = appointments.findIndex((a) => a.id === id)
    if (index === -1) {
        return null;
    }

    // keeps all existing fields and  re writes only the ones passed in data
    const updatedAppointment: Appointment = {
        ...appointments[index],
        ...data,
    };

    appointments[index] = updatedAppointment;
    return updatedAppointment;
};

export const deleteAppointmentService = async (id: number): Promise<boolean> => {
    const index = appointments.findIndex((a) => a.id === id)
    if (index === -1) {
        return false
    }
    appointments.splice(index, 1)
    return true
}