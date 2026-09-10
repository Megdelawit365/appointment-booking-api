# Appontment booking api

This project is a backend api for managing hospital appointments and patient records. It allows patients to book, view and modify their appointments, and allows doctors and admins to manage schedules and appointment statuses.

## Features

- User registration and login
- Sign in using google oauth 2.0
- Authentication using short lived access tokens and refresh cookies
- Role based access for patients, doctors and admins
- Appointment creation with time and operating hour checks
- Ownership checks to prevent unauthorized access

# Project structure 

```bash
appointment-booking-api/
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
└── src/
    ├── app.ts
    ├── server.ts
    ├── config/
    │   └── env.ts
    ├── schemas/
    │   ├── auth.schema.ts
    │   └── appointment.schema.ts
    ├── middlewares/
    │   ├── validate.middleware.ts
    │   ├── auth.middleware.ts
    │   ├── permission.middleware.ts
    │   ├── ownership.middleware.ts
    │   └── error.middleware.ts
    ├── controllers/
    │   ├── auth.controller.ts
    │   ├── oauth.controller.ts
    │   ├── appointment.controller.ts
    │   └── admin.controller.ts
    ├── services/
    │   ├── auth.service.ts
    │   ├── appointment.service.ts
    │   └── oauth.service.ts
    ├── utils/
    │   └── auth.util.ts
    ├── types/
    │   └── express.d.ts
    └── routes/
        ├── auth.routes.ts
        ├── appointment.routes.ts
        └── admin.routes.ts

```


## Setup instructions

1. clone the repository

```bash
git clone https://github.com/Megdelawit365/appointment-booking-api
```

2. Install dependencies by running:

```bash
npm install
```

3. Create a .env file in the root directory and configure the environment variables according to the .env.example file

4. run database migrations:

```bash
npx prisma migrate dev
```

5. Seed the database with default roles and permissions:

```bash
npx prisma db seed
```

6. start the  server:

```bash 
npm run dev
```

## api endpoints

* post /api/auth/register - create a new patient account 
* post /api/auth/login - log in with email and password 
* post /api/auth/refresh - refresh access token using cookies 
* post /api/auth/logout - log out and invalidate refresh token 
* get /api/auth/google - start google oauth sign in process 
* get /api/auth/google/callback - finish google oauth sign in process 
* post /api/appointments - create a new appointment 
* get /api/appointments - fetch allowed appointments list 
* get /api/appointments/:id - fetch specific appointment by id 
* patch /api/appointments/:id - update pending appointment details 
* patch /api/appointments/:id/status - update appointment status for doctors and admins 
* delete /api/appointments/:id - cancel a pending appointment 
* get /api/admin/metrics - view system metrics for adminis