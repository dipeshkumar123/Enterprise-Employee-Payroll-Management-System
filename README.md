# Enterprise Employee Payroll Management System

A local-first employee, attendance, and payroll management system built with Spring Boot microservices, React, MySQL, and Docker Compose.

## Features

- JWT authentication with Admin, HR, Manager, and Employee roles
- Employee registration with an automatically linked employee profile
- Self-service employee attendance marking
- Department and designation management
- Attendance summaries and payroll workflows
- API gateway and Eureka service discovery

## Architecture

```text
Browser (React / Vite, port 3000)
            |
            v
API Gateway (port 8080)
            |
   +--------+---------+----------+---------+
   |        |         |          |         |
Auth     Employee  Attendance  Payroll  Eureka
8081       8082       8083      8084     8761
   \        |         |          /         |
    \-------+---------+---------/          |
                    |                      |
                  MySQL (port 3307) -------+
```

## Services

| Service | Local port | Purpose |
| --- | ---: | --- |
| Frontend | 3000 | React user interface |
| API Gateway | 8080 | Routes frontend API requests |
| Auth Service | 8081 | Authentication and roles |
| Employee Service | 8082 | Employee, department, and designation data |
| Attendance Service | 8083 | Attendance records and summaries |
| Payroll Service | 8084 | Payroll processing |
| Service Registry | 8761 | Eureka service discovery |
| MySQL | 3307 | Local database container |

## Requirements

- Docker Desktop with Docker Compose
- Node.js 20 or later

## Run locally

Start all backend services and MySQL:

```bash
docker compose up -d --build
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

The local administrator account is:

```text
Email: admin@example.com
Password: Admin@123
```

## Employee attendance flow

1. A user signs up and receives the `EMPLOYEE` role.
2. The system creates a linked employee profile automatically.
3. The employee opens Attendance and selects `Mark today as present`.
4. The backend reads the signed-in user from the JWT and records attendance for that employee only.

## Tests

Run the frontend browser tests:

```bash
cd frontend
npx playwright test
```

Build the frontend:

```bash
cd frontend
npm run build
```

## Stop local services

```bash
docker compose down
```
