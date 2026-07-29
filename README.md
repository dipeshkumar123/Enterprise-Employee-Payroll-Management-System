# Enterprise Employee & Payroll Management System

A microservices-based employee and payroll management system built with Spring Boot, Spring Cloud, Spring Security, JWT, MySQL, and Docker. The system handles the complete employee lifecycle: authentication, employee records, attendance tracking, and payroll generation.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Services & Responsibilities](#services--responsibilities)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Running Services Individually](#running-services-individually)
- [API Endpoints](#api-endpoints)
- [Complete Demo Flow](#complete-demo-flow)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)
- [Design Decisions & Challenges](#design-decisions--challenges)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Microservices | Spring Cloud Gateway, Eureka Service Discovery |
| Security | Spring Security, JWT (jjwt 0.11.5), BCrypt |
| ORM | Spring Data JPA, Hibernate 6 |
| Database | MySQL 8.0 (separate schema per service) |
| Build | Maven (wrapped per service) |
| Containerization | Docker, Docker Compose |
| Testing | JUnit 5, Mockito, Spring Boot Test |
| CI/CD | GitHub Actions |

---

## Architecture Overview

```
                         ┌──────────────┐
                         │   Client     │
                         │ (curl/Postman)│
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │ API Gateway  │
                         │  Port 8080   │
                         └──────┬───────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
   ┌──────▼──────┐    ┌────────▼───────┐    ┌────────▼───────┐
   │ Auth Service│    │Employee Service│    │Attendance Svc  │
   │  Port 8081  │    │   Port 8082    │    │   Port 8083    │
   └──────┬──────┘    └────────┬───────┘    └────────┬───────┘
          │                    │                     │
          │              ┌─────▼──────┐              │
          │              │Payroll Svc │              │
          │              │ Port 8084  │              │
          │              └─────┬──────┘              │
          │                    │                     │
          └────────────────────┼─────────────────────┘
                               │
                        ┌──────▼───────┐
                        │   Eureka     │
                        │  Port 8761   │
                        └──────┬───────┘
                               │
                        ┌──────▼───────┐
                        │    MySQL     │
                        │  Port 3307   │
                        └──────────────┘
```

**Communication flow:**

1. All external requests go through the **API Gateway** (port 8080).
2. The gateway routes requests to the appropriate service based on the URL path.
3. Services register themselves with **Eureka** for dynamic discovery.
4. The **Payroll Service** calls Employee and Attendance services internally via REST to fetch data for salary calculation.
5. Each service has its own **MySQL schema** (`auth_db`, `employee_db`, `attendance_db`, `payroll_db`).

---

## Services & Responsibilities

### Auth Service (port 8081)
- User registration and login
- JWT token generation and validation
- Role-based access control (ADMIN, HR, MANAGER, EMPLOYEE)
- Password hashing with BCrypt
- On first startup, seeds an admin account automatically

### Employee Service (port 8082)
- Full CRUD for employees
- Department and designation management
- Search employees by name or department
- DTO-based API (entities never exposed directly)
- Validation on all inputs

### Attendance Service (port 8083)
- Mark daily attendance (PRESENT, ABSENT, LEAVE, HALF_DAY)
- Update existing attendance records
- Monthly attendance summary per employee
- Business rule: one record per employee per day (duplicates prevented)

### Payroll Service (port 8084)
- Salary structure management (base, HRA, allowances, deductions)
- Monthly payroll generation based on attendance
- Payslip generation with full breakdown
- Inter-service communication: fetches employee details and attendance data from other services

### API Gateway (port 8080)
- Single entry point for all requests
- Routes to the correct service based on path
- CORS configuration for frontend access

### Service Registry (port 8761)
- Eureka server for service discovery
- All services register on startup
- Enables dynamic routing through the gateway

---

## Key Features

- **Microservices architecture** — each service is independently deployable and scalable
- **JWT authentication** — stateless security with role-based authorization
- **Database-per-service** — each service owns its data with a separate MySQL schema
- **Service discovery** — Eureka enables services to find each other dynamically
- **API Gateway** — single entry point simplifies client integration
- **Inter-service communication** — Payroll Service calls Employee and Attendance services via REST clients with error handling
- **Global exception handling** — consistent error responses across all services
- **Input validation** — DTO-level validation with meaningful error messages
- **Containerized** — Docker Compose starts the entire system with one command
- **CI/CD pipeline** — GitHub Actions workflow for build, test, package, and deploy

---

## Project Structure

```
.
├── auth-service/               # Authentication & authorization
│   ├── src/main/java/com/payroll/auth/
│   │   ├── config/             # Security configuration, data seeder
│   │   ├── controller/         # AuthController (register, login, validate, me)
│   │   ├── dto/                # AuthRequest, AuthResponse, RegisterRequest
│   │   ├── entity/             # User, Role
│   │   ├── exception/          # InvalidCredentialsException, GlobalExceptionHandler
│   │   ├── repository/         # UserRepository, RoleRepository
│   │   ├── security/           # JwtUtil, JwtAuthenticationFilter, SecurityConfig, CustomUserDetailsService
│   │   └── service/            # AuthService
│   └── src/test/
│
├── employee-service/           # Employee CRUD
│   ├── src/main/java/com/payroll/employee/
│   │   ├── controller/         # EmployeeController
│   │   ├── dto/                # EmployeeDto, EmployeeResponse
│   │   ├── entity/             # Employee
│   │   ├── exception/          # InvalidRequestException, UnauthorizedException, GlobalExceptionHandler
│   │   ├── repository/         # EmployeeRepository
│   │   └── service/            # EmployeeService, EmployeeServiceImpl
│   └── src/test/
│
├── attendance-service/         # Attendance tracking
│   ├── src/main/java/com/payroll/attendance/
│   │   ├── controller/         # AttendanceController
│   │   ├── dto/                # AttendanceDto, MonthlySummary
│   │   ├── entity/             # Attendance
│   │   ├── enums/              # AttendanceStatus
│   │   ├── exception/          # InvalidRequestException, UnauthorizedException, GlobalExceptionHandler
│   │   ├── repository/         # AttendanceRepository
│   │   └── service/            # AttendanceService, AttendanceServiceImpl
│   └── src/test/
│
├── payroll-service/            # Payroll calculation
│   ├── src/main/java/com/payroll/payroll/
│   │   ├── client/             # EmployeeClient, AttendanceClient (REST clients)
│   │   ├── config/             # AppConfig, DataSeeder
│   │   ├── controller/         # PayrollController
│   │   ├── dto/                # PayrollDto, PayslipDto, EmployeeDto, MonthlyAttendanceSummary
│   │   ├── entity/             # Payroll, SalaryStructure
│   │   ├── enums/              # PayrollStatus
│   │   ├── exception/          # ResourceNotFoundException, DuplicateResourceException, InvalidPayrollDataException, ServiceUnavailableException, GlobalExceptionHandler
│   │   ├── repository/         # PayrollRepository, SalaryStructureRepository
│   │   └── service/            # PayrollService, PayrollServiceImpl
│   └── src/test/
│
├── gateway-service/            # API Gateway
│   ├── src/main/java/com/payroll/gateway/
│   │   ├── config/             # LoggingFilter, CorsConfig
│   │   └── GatewayApplication.java
│
├── service-registry/           # Eureka Server
│   └── src/main/java/com/payroll/registry/
│       └── RegistryApplication.java
│
├── docker-compose.yml          # Orchestrates all services
├── init-db.sql                 # Creates MySQL schemas on first run
├── .github/workflows/ci-cd.yml # CI/CD pipeline
└── README.md                   # This file
```

---

## Prerequisites

- **Docker Desktop** (with Docker Compose) — recommended for local development
- **Java 17+** — if running services outside Docker
- **Maven 3.8+** — if running services outside Docker
- **MySQL 8.0** — if running services outside Docker

---

## Quick Start (Docker)

This is the recommended way to run the project. It starts all services, MySQL, and Eureka with a single command.

```bash
# 1. Clone the repository
git clone https://github.com/dipeshkumar123/Enterprise-Employee-Payroll-Management-System.git
cd Enterprise-Employee-Payroll-Management-System

# 2. Start everything
docker compose up --build
```

**What happens:**
1. Docker builds each service from its Dockerfile
2. MySQL starts and runs `init-db.sql` to create the four schemas
3. Eureka (service-registry) starts
4. Gateway, Auth, Employee, Attendance, and Payroll services start in order
5. Each service registers with Eureka

**Wait for all services to be healthy** (check the terminal output or visit http://localhost:8761).

**Default admin account** (seeded automatically on first startup):

| Field | Value |
|-------|-------|
| Username | `admin` |
| Email | `admin@example.com` |
| Password | `Admin@123` |

**Access points:**

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |
| Auth Service (direct) | http://localhost:8081 |
| Employee Service (direct) | http://localhost:8082 |
| Attendance Service (direct) | http://localhost:8083 |
| Payroll Service (direct) | http://localhost:8084 |

**Stop everything:**

```bash
docker compose down
```

To also delete the MySQL data volume:

```bash
docker compose down -v
```

---

## Running Services Individually

If you prefer to run services outside Docker (e.g., for debugging), follow these steps.

### 1. Start MySQL

```bash
docker run --name erp-mysql -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -d mysql:8.0
```

Then create the schemas:

```bash
mysql -h 127.0.0.1 -P 3307 -u root -prootpassword -e "
  CREATE DATABASE IF NOT EXISTS auth_db;
  CREATE DATABASE IF NOT EXISTS employee_db;
  CREATE DATABASE IF NOT EXISTS attendance_db;
  CREATE DATABASE IF NOT EXISTS payroll_db;
"
```

### 2. Start Eureka (Service Registry)

```bash
cd service-registry
./mvnw spring-boot:run
```

Wait for Eureka to be available at http://localhost:8761.

### 3. Start Business Services

Open separate terminals for each service and run:

```bash
# Terminal 1: Auth Service
cd auth-service
./mvnw spring-boot:run

# Terminal 2: Employee Service
cd employee-service
./mvnw spring-boot:run

# Terminal 3: Attendance Service
cd attendance-service
./mvnw spring-boot:run

# Terminal 4: Payroll Service
cd payroll-service
./mvnw spring-boot:run
```

### 4. Start Gateway

```bash
cd gateway-service
./mvnw spring-boot:run
```

All services should now be registered in Eureka at http://localhost:8761.

---

## API Endpoints

All endpoints are accessible through the API Gateway at `http://localhost:8080`.

### Auth Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT | No |
| GET | `/auth/validate` | Validate a JWT token | No |
| GET | `/auth/me` | Get current authenticated user info | Yes |

### Employee Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/employees` | Create a new employee | Yes |
| GET | `/employees` | List all employees | Yes |
| GET | `/employees/{id}` | Get employee by ID | Yes |
| PUT | `/employees/{id}` | Update an employee | Yes |
| DELETE | `/employees/{id}` | Delete an employee | Yes |
| GET | `/employees/search` | Search by name or department | Yes |

### Attendance Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/attendance` | Mark attendance for today | Yes |
| PUT | `/attendance/{id}` | Update an attendance record | Yes |
| GET | `/attendance/{employeeId}` | Get attendance by employee ID | Yes |
| GET | `/attendance/monthly/{employeeId}` | Get monthly attendance summary | Yes |
| GET | `/attendance/date/{date}` | Get attendance records by date | Yes |

### Payroll Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/payroll/generate` | Generate payroll for a month | Yes |
| GET | `/payroll/{id}` | Get payroll by ID | Yes |
| GET | `/payroll/employee/{employeeId}` | Get payroll history for an employee | Yes |
| GET | `/payroll/payslip/{employeeId}` | Generate and fetch a payslip | Yes |

---

## Complete Demo Flow

This walks through the core business flow from start to finish.

### Step 1: Login as Admin

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "roles": ["ADMIN"]
}
```

Save the `token` value — you'll use it as `YOUR_JWT_TOKEN` in subsequent requests.

### Step 2: Create an Employee

```bash
curl -X POST http://localhost:8080/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@company.com",
    "phone": "+9876543210",
    "department": "Engineering",
    "designation": "Senior Developer",
    "joiningDate": "2024-06-01",
    "status": "ACTIVE",
    "baseSalary": 75000
  }'
```

**Response** (note the `id` — you'll need it):
```json
{
  "id": 1,
  "name": "Jane Smith",
  "email": "jane.smith@company.com",
  "department": "Engineering",
  "designation": "Senior Developer",
  "status": "ACTIVE",
  "baseSalary": 75000
}
```

### Step 3: Mark Attendance

Mark attendance for several days to build a monthly record.

```bash
curl -X POST http://localhost:8080/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employeeId": 1,
    "date": "2024-06-03",
    "status": "PRESENT",
    "checkInTime": "09:00:00",
    "checkOutTime": "18:00:00"
  }'
```

Repeat for different dates and statuses (PRESENT, ABSENT, LEAVE, HALF_DAY).

### Step 4: View Monthly Attendance Summary

```bash
curl -X GET "http://localhost:8080/attendance/monthly/1?year=2024&month=6" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 5: Generate Payroll

```bash
curl -X POST "http://localhost:8080/payroll/generate?employeeId=1&year=2024&month=6" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 6: Fetch Payslip

```bash
curl -X GET "http://localhost:8080/payroll/payslip/1?year=2024&month=6" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Running Tests

Each service has its own test suite. Run tests for a specific service:

```bash
cd auth-service && ./mvnw test
cd employee-service && ./mvnw test
cd attendance-service && ./mvnw test
cd payroll-service && ./mvnw test
```

**Test coverage:**

| Service | Tests | What's tested |
|---------|-------|---------------|
| Auth Service | 3 | Duplicate username, user-not-found, invalid password |
| Employee Service | 10 | CRUD operations, search, validation, error cases |
| Attendance Service | 7 | Mark attendance, monthly summary, duplicate prevention |
| Payroll Service | 6 | Payroll generation, payslip, error handling |

---

## Troubleshooting

### "Connection refused" when services try to reach Eureka

**Cause:** Services start before Eureka is ready.

**Fix:** Docker Compose handles this with `depends_on` and health checks. If running locally, start Eureka first and wait for it to be available before starting other services.

### MySQL connection errors

**Cause:** MySQL takes a few seconds to initialize on first run.

**Fix:** Docker Compose waits for MySQL's health check to pass. If running locally, ensure MySQL is running and the schemas exist.

### Port already in use

If port 3307, 8080-8084, or 8761 is already in use:

1. Stop the process using that port, or
2. Change the port in `docker-compose.yml` and the service's `application.yml`

### Services not registering with Eureka

Check the service logs for connection errors. Ensure the `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` environment variable points to the correct Eureka URL.

### "401 Unauthorized" on API calls

Make sure you're including the JWT token in the `Authorization: Bearer YOUR_JWT_TOKEN` header. Tokens expire after 24 hours — login again to get a fresh one.

---

## Design Decisions & Challenges

### Why separate databases per service?

In a microservices architecture, each service should own its data. Separate schemas (or databases) prevent tight coupling and allow each service to evolve independently. We started with separate schemas in a single MySQL instance; these can be split into separate database servers later if needed.

### Why REST for inter-service communication?

REST is simple, well-understood, and sufficient for this use case. The Payroll Service calls Employee and Attendance services synchronously to fetch data. For production, you might add Resilience4j circuit breakers and retries, or switch to async messaging (Kafka/RabbitMQ) for better resilience.

### JWT token design

Tokens include the username and roles, expire after 24 hours, and are signed with a configurable secret. The `JwtAuthenticationFilter` intercepts every request (except public endpoints) and validates the token before passing it to the controller.

### Attendance duplicate prevention

The Attendance Service checks for an existing record with the same `employeeId` and `date` before creating a new one. This is enforced at the service layer (not just the database) to provide clear error messages.

### Payroll calculation

The Payroll Service calculates salary based on:
- Base salary from the Employee Service
- Attendance data from the Attendance Service
- Salary structure (HRA, allowances, deductions) from its own database

If either service is unavailable, the payroll service returns a clear error message rather than failing silently.

### CI/CD pipeline

The GitHub Actions workflow builds and tests every service in parallel, packages them, builds Docker images, pushes them to Docker Hub, and deploys using Docker Compose. This ensures that every commit is validated and deployable.