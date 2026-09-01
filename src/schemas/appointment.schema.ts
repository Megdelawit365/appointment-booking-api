import { z } from "zod"


export const createAppointmentSchema = z.object({
    body: z.object({
        patientName: z
            .string({ message: "Patient name is required." })
            .trim()
            .toLowerCase()
            .min(3, "Name must be atleast 3 characters.")
            .max(60, "Name must not exceed 60 characters"),
        patientEmail: z
            .email({ message: "Patient email is required." })
            .toLowerCase()
            .trim(),
        patientPhone: z
            .string({ message: "Patient phone number is required." })
            .regex(/^\+?[0-9]{10,14}$/, 'Invalid phone number format.'),
        department: z
            .enum([
                'GENERAL_PRACTICE',
                'DENTISTRY',
                'CARDIOLOGY',
                'DERMATOLOGY',
                'PEDIATRICS',
            ]),
        appointmentDate: z
            .iso.datetime({ message: 'Must be a valid ISO-8601 datetime string' })
            .refine((val) => new Date(val) > new Date(), {
                message: 'Appointment date must be in the future',
            })
            .refine((val) => {
                const hours = new Date(val).getUTCHours()
                return hours >= 8 && hours <= 17
            },
                { message: "Appointments must be scheduled during clinic hours (08:00 - 17:00 UTC)" }
            ),
        isEmergency: z.boolean().default(false),
        symptoms: z
            .string({ message: "Symptoms are required" })
            .min(10, "Symptoms must be atleast 10 characters.")
    })

})

export const updateAppointmentSchema = z.object({
    body: createAppointmentSchema.shape.body.partial()
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>['body'];
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>['body'];