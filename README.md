# Appointment Booking API

RESTful API for booking and managing appointments built with Node.js, Express, TypeScript, Zod, and Prisma.

## Features

- Create, view, update, and delete appointments
- Validate input data with Zod
- Type safety across requests and parameters with TypeScript
- Store data in memory using arrays

## API Endpoints

- GET /appointments - Get all appointments with optional query filtering
- GET /appointments/:id - Get a single appointment by ID
- POST /appointments - Create a new appointment
- PATCH /appointments/:id - Update an  appointment
- DELETE /appointments/:id - Delete an appointment

## Tech Stack

- Node.js
- Express
- TypeScript
- Zod

## Setup Instructions

- Clone the repository

```bash
git clone https://github.com/Megdelawit365/appointment-booking-api
cd appointment-booking-api
```

- Install dependencies

```bash
npm install
```

- Start server

```bash
npm run dev
```
