# Appontment booking api

This project is a backend api for managing medical appointments. It allows users to register, log in, book appointments and manage schedules securely.


## setup instructions

1. clone the repository

2. install dependencies by running:
npm install

1. create a .env file in the root directory and configure your environment variables according to the .env.example file

2. run database migrations to setup the postgresql tables:
npx prisma migrate dev

5. seed the database with default roles and permissions:
npx prisma db seed

1. start the  server:
npm run dev

## key features

* user registration and login .
* sign in using google oauth 2.0.
* authentication using short lived access tokens and refresh cookies.
* role based access for patients, doctors and admins.
* appointment creation with time and operating hour checks.
* ownership checks to prevent unauthorized access.

## api endpoints

* post /api/auth/register - create a new patient account.
* post /api/auth/login - log in with email and password.
* post /api/auth/refresh - refresh access token using cookies.
* post /api/auth/logout - log out and invalidate refresh token.
* get /api/auth/google - start google oauth sign in process.
* get /api/auth/google/callback - finish google oauth sign in process.
* post /api/appointments - create a new appointment.
* get /api/appointments - fetch allowed appointments list.
* get /api/appointments/:id - fetch specific appointment by id.
* patch /api/appointments/:id - update pending appointment details.
* patch /api/appointments/:id/status - update appointment status for doctors and admins.
* delete /api/appointments/:id - cancel a pending appointment.
* get /api/admin/metrics - view system metrics for administrators.