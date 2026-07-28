# Enterprise Employee & Payroll Management System

A scalable microservices-based employee and payroll management system built with Spring Boot, Spring Cloud, Spring Security, MySQL, and Docker.

## Architecture

```
                  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
                  Ã¢â€â€š   Client    Ã¢â€â€š
                  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
                         Ã¢â€â€š
                  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
                  Ã¢â€â€š   API Gateway       Ã¢â€â€š
                  Ã¢â€â€š   Port: 8080        Ã¢â€â€š
                  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
                         Ã¢â€â€š
            Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
            Ã¢â€â€š            Ã¢â€â€š            Ã¢â€â€š
     Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
     Ã¢â€â€š Auth ServiceÃ¢â€â€š Ã¢â€â€šEmployeeÃ¢â€â€š Ã¢â€â€šAttendanceÃ¢â€â€š
     Ã¢â€â€š  Port: 8081 Ã¢â€â€š Ã¢â€â€šService Ã¢â€â€š Ã¢â€â€š Service  Ã¢â€â€š
     Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€šPort:   Ã¢â€â€š Ã¢â€â€š Port:    Ã¢â€â€š
                     Ã¢â€â€š 8082   Ã¢â€â€š Ã¢â€â€š 8083     Ã¢â€â€š
                     Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
                            Ã¢â€â€š
                     Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
                     Ã¢â€â€š Payroll     Ã¢â€â€š
                     Ã¢â€â€š Service     Ã¢â€â€š
                     Ã¢â€â€š Port: 8084  Ã¢â€â€š
                     Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ

                  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
                  Ã¢â€â€š    Eureka   Ã¢â€â€š
                  Ã¢â€â€š   Registry  Ã¢â€â€š
                  Ã¢â€â€š  Port: 8761 Ã¢â€â€š
                  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
                         Ã¢â€â€š
                  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€“Â¼Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
                  Ã¢â€â€š    MySQL    Ã¢â€â€š
                  Ã¢â€â€š  Port: 3307 Ã¢â€â€š
                  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
```

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA, Hibernate
- **Microservices**: Spring Cloud Gateway, Eureka Service Discovery
- **Security**: JWT authentication, BCrypt password encoding, role-based access control
- **Database**: MySQL 8.0 with separate schemas per service
- **Build**: Maven
- **Containerization**: Docker, Docker Compose
- **Testing**: JUnit 5, Mockito, Spring Test

## Database Schema

### Auth Service Schema (`auth_db`)
- `user` - User credentials and basic info
- `role` - User roles (ADMIN, EMPLOYEE)
- `user_role` - Many-to-many relationship between users and roles

### Employee Service Schema (`employee_db`)
- `employee` - Employee details (name, email, phone, department, designation, joining date, status, base salary)

### Attendance Service Schema (`attendance_db`)
- `attendance` - Daily attendance records (employee_id, date, status, check-in, check-out)
  - Status: PRESENT, ABSENT, LEAVE, HALF_DAY

### Payroll Service Schema (`payroll_db`)
- `salary_structure` - Salary components (base, HRA, allowances, deductions)
- `payroll` - Monthly payroll records
- `payslip` - Generated payslips

## Services & Ports

| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 8080 | Single entry point, routes to services |
| Service Registry | 8761 | Eureka server for service discovery |
| Auth Service | 8081 | Authentication & authorization |
| Employee Service | 8082 | Employee CRUD operations |
| Attendance Service | 8083 | Attendance tracking |
| Payroll Service | 8084 | Salary calculation & payslips |
| MySQL | 3307 | Database |

## API Endpoints

### Auth Service (`/auth`)
```
POST   /auth/register     - Register new user
POST   /auth/login        - Login and get JWT token
GET    /auth/validate     - Validate JWT token
GET    /auth/me           - Get current user info
```

### Employee Service (`/employees`)
```
POST   /employees              - Create employee
GET    /employees              - Get all employees (with pagination)
GET    /employees/{id}         - Get employee by ID
PUT    /employees/{id}         - Update employee
DELETE /employees/{id}         - Delete employee
GET    /employees/search       - Search employees by name/department
```

### Attendance Service (`/attendance`)
```
POST   /attendance                      - Mark attendance
PUT    /attendance/{id}                 - Update attendance
GET    /attendance/{employeeId}         - Get attendance by employee
GET    /attendance/monthly/{employeeId} - Get monthly attendance summary
GET    /attendance/date/{date}          - Get attendance by date
```

### Payroll Service (`/payroll`)
```
POST   /payroll/generate               - Generate payroll for month
GET    /payroll/{id}                   - Get payroll by ID
GET    /payroll/employee/{employeeId}  - Get employee payroll history
GET    /payroll/payslip/{employeeId}   - Generate and get payslip
```

## Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- MySQL 8.0 (optional, if running locally without Docker)

### Running with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd payroll-management-system
   ```

2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. Access services:
   - API Gateway: http://localhost:8080
   - Eureka Dashboard: http://localhost:8761
   - MySQL: localhost:3307

### Running Locally

1. Start MySQL and create schemas:
   ```sql
   CREATE DATABASE auth_db;
   CREATE DATABASE employee_db;
   CREATE DATABASE attendance_db;
   CREATE DATABASE payroll_db;
   ```

2. Update `application.yml` in each service with local MySQL credentials

3. Start Eureka Server first:
   ```bash
   cd service-registry
   ./mvnw spring-boot:run
   ```

4. Start other services in order:
   ```bash
   cd auth-service && ./mvnw spring-boot:run
   cd employee-service && ./mvnw spring-boot:run
   cd attendance-service && ./mvnw spring-boot:run
   cd payroll-service && ./mvnw spring-boot:run
   cd gateway-service && ./mvnw spring-boot:run
   ```

## Sample Requests

### 1. Register Admin User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@company.com",
    "roles": ["ADMIN"]
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "roles": ["ADMIN"]
}
```

### 3. Create Employee
```bash
curl -X POST http://localhost:8080/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@company.com",
    "phone": "+1234567890",
    "department": "Engineering",
    "designation": "Software Engineer",
    "joiningDate": "2024-01-15",
    "status": "ACTIVE",
    "baseSalary": 50000
  }'
```

### 4. Mark Attendance
```bash
curl -X POST http://localhost:8080/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "employeeId": 1,
    "date": "2024-01-15",
    "status": "PRESENT",
    "checkInTime": "09:00:00",
    "checkOutTime": "18:00:00"
  }'
```

### 5. Generate Payroll
```bash
curl -X POST "http://localhost:8080/payroll/generate?employeeId=1&year=2024&month=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Fetch Payslip
```bash
curl -X GET http://localhost:8080/payroll/payslip/1?year=2024&month=1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Demo Flow

### Prerequisites
1. Start the system: `docker-compose up --build`
2. Wait for all services to be healthy (check Eureka dashboard at http://localhost:8761)

### Step-by-Step Demo

1. **Register Admin User**
   - Use sample request #1 above
   - Copy the JWT token from response

2. **Login**
   - Use sample request #2
   - Copy the new JWT token

3. **Create Employee**
   - Use sample request #3 with the JWT token
   - Note the employee ID from response (e.g., ID: 1)

4. **Mark Attendance**
   - Use sample request #4 with employee ID
   - Repeat for multiple dates to test monthly summary

5. **Get Monthly Attendance**
   ```bash
   curl -X GET http://localhost:8080/attendance/monthly/1?year=2024&month=1 \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

6. **Generate Payroll**
   - Use sample request #5
   - System calculates salary based on attendance and salary structure

7. **Fetch Payslip**
   - Use sample request #6
   - Review detailed salary breakdown

## Testing

Run tests for individual services:
```bash
cd auth-service && ./mvnw test
cd employee-service && ./mvnw test
cd attendance-service && ./mvnw test
cd payroll-service && ./mvnw test
```

## Project Structure

```
.
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ auth-service/             # Authentication & authorization
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ src/main/java/com/payroll/auth/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ config/           # Security configuration
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ controller/       # REST controllers
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ dto/              # Data transfer objects
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ entity/           # JPA entities
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ repository/       # Spring Data repositories
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ security/         # JWT filter, utilities
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ service/          # Business logic
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ src/test/             # Unit & integration tests
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ employee-service/         # Employee management
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ attendance-service/       # Attendance tracking
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ payroll-service/          # Payroll calculation
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ gateway-service/          # API Gateway
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ service-registry/         # Eureka server
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ docker-compose.yml        # Orchestration
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ init-db.sql               # Database initialization
```

## Key Features

- **Microservices Architecture**: Separate, independently scalable services
- **Service Discovery**: Dynamic service registration with Eureka
- **API Gateway**: Single entry point with routing
- **Security**: JWT-based authentication, role-based authorization
- **Database per Service**: Separate schemas for data isolation
- **Inter-service Communication**: REST clients with error handling
- **Validation & Exception Handling**: Global exception handlers, request validation
- **Testing**: Unit tests, integration tests, controller tests
- **Dockerization**: All services containerized

## Local Development

Run the backend services and MySQL locally with Docker Compose:

```bash
docker compose up -d --build
```

Start the frontend locally in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Local URLs:

- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:8080`
- Eureka: `http://localhost:8761`
## Future Enhancements

- Add Swagger/OpenAPI documentation for each service
- Implement rate limiting and circuit breakers (Resilience4j)
- Add message queue for async payroll processing
- Implement file upload for employee documents
- Add email notifications for payslips
- Implement audit logging
- Add metrics and monitoring with Prometheus/Grafana
- Implement distributed tracing with Sleuth/Zipkin

## License

This project is for educational and portfolio purposes.
