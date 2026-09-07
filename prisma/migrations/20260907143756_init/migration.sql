-- CreateEnum
CREATE TYPE "DepartmentEnum" AS ENUM ('GENERAL_PRACTICE', 'DENTISTRY', 'CARDIOLOGY', 'DERMATOLOGY', 'PEDIATRICS');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "department" "DepartmentEnum" NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "isEmergency" BOOLEAN NOT NULL,
    "symptoms" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
