# Enterprise Employee & Payroll Management System

A scalable microservices-based employee and payroll management system built with Spring Boot, Spring Cloud, Spring Security, MySQL, Docker, and GitHub Actions CI/CD.

## Architecture

```
                  ┌─────────────┐
                  │   Client    │
                  └──────┬──────┘
                         │
                  ┌──────▼──────────────┐
                  │   API Gateway       │
                  │   Port: 8080        │
                  └──────┬──────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
     ┌──────▼──────┐ ┌──▼─────┐ ┌────▼──────┐
     │ Auth Service│ │Employee│ │Attendance│
     │  Port: 8081 │ │Service │ │ Service  │
     └─────────────┘ │Port:   │ │ Port:    │
                     │ 8082   │ │ 8083     │
                     └─────────┘ └──────────┘
                            │
                     ┌──────▼──────┐
                     │ Payroll     │
                     │ Service     │
                     │ Port: 8084  │
                     └─────────────┘

                  ┌─────────────┐
                  │    Eureka   │
                  │   Registry  │
                  │  Port: 8761 │
                  └─────────────┘
                         │
                  ┌──────▼──────┐
                  │    MySQL    │
                  │  Port: 3307 │
                  └─────────────┘
```

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA, Hibernate
- **Microservices**: Spring Cloud Gateway, Eureka Service Discovery
- **Security**: JWT authentication, BCrypt password encoding, role-based access control
- **Database**: MySQL 8.0 with separate schemas per service
- **Build**: Maven
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
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

## CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. **Build & Test** - Runs tests for all services on every push/PR
2. **Package** - Creates JAR artifacts
3. **Docker Build** - Builds Docker images for all services
4. **Push** - Pushes images to Docker Hub (requires secrets)
5. **Deploy** - Runs `docker compose up -d --build`

### Required Secrets
- `DOCKERHUB_USERNAME` - Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token

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
├── auth-service/             # Authentication & authorization
│   ├── src/main/java/com/payroll/auth/
│   │   ├── config/           # Security configuration
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Data transfer objects
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Spring Data repositories
│   │   ├── security/         # JWT filter, utilities
│   │   └── service/          # Business logic
│   └── src/test/             # Unit & integration tests
├── employee-service/         # Employee management
├── attendance-service/       # Attendance tracking
├── payroll-service/          # Payroll calculation
├── gateway-service/          # API Gateway
├── service-registry/         # Eureka server
├── docker-compose.yml        # Orchestration
├── init-db.sql               # Database initialization
└── .github/workflows/ci-cd.yml # CI/CD pipeline
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
- **CI/CD**: Automated build, test, and deployment pipeline

## Deployment Guide

### Frontend Deployment (Vercel / Netlify)

#### Option A: Vercel (Recommended — Free & Easy)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the `frontend/` directory
3. Set environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api` (or your backend URL)
4. Deploy — Vercel auto-detects Vite and uses `vercel.json`

#### Option B: Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) and import the `frontend/` directory
3. Build settings auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variable `VITE_API_URL` in Netlify dashboard
5. Deploy

#### Manual Build

```bash
cd frontend
npm install
npm run build    # Outputs to frontend/dist/
# Deploy the dist/ folder to any static host
```

### Backend Deployment

#### Option A: Docker Compose (Local / VPS)

```bash
# On any machine with Docker installed
docker-compose up --build -d
```

Services will be available at:
- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:8080`
- Eureka: `http://localhost:8761`

#### Option B: Cloud VM (AWS EC2 / DigitalOcean / Linode)

1. Provision a VM (Ubuntu 22.04, min 4GB RAM)
2. Install Docker & Docker Compose
3. Clone repo and run:

```bash
git clone <your-repo-url>
cd payroll-management-system
docker-compose up --build -d
```

4. Set up Nginx reverse proxy (see `nginx.conf`)

#### Option C: Render / Railway (Simplified Cloud Deployment)

Each service can be deployed as a separate web service:

| Service | Build Command | Start Command | Port |
|---------|---------------|---------------|------|
| service-registry | `./mvnw clean package -DskipTests` | `java -jar target/service-registry-0.0.1-SNAPSHOT.jar` | 8761 |
| auth-service | `./mvnw clean package -DskipTests` | `java -jar target/auth-service-0.0.1-SNAPSHOT.jar` | 8081 |
| employee-service | `./mvnw clean package -DskipTests` | `java -jar target/employee-service-0.0.1-SNAPSHOT.jar` | 8082 |
| attendance-service | `./mvnw clean package -DskipTests` | `java -jar target/attendance-service-0.0.1-SNAPSHOT.jar` | 8083 |
| payroll-service | `./mvnw clean package -DskipTests` | `java -jar target/payroll-service-0.0.1-SNAPSHOT.jar` | 8084 |
| gateway-service | `./mvnw clean package -DskipTests` | `java -jar target/gateway-service-0.0.1-SNAPSHOT.jar` | 8080 |

**Important:** Use [Aiven](https://aiven.io) or [Railway MySQL](https://railway.app) for managed MySQL.

### Database

**Local:** MySQL runs in Docker via `docker-compose.yml` (port 3307)

**Production:** Use a managed MySQL service:
- [Aiven MySQL](https://aiven.io/mysql) — Free tier available
- [Railway MySQL](https://railway.app) — Simple setup
- [AWS RDS](https://aws.amazon.com/rds/) — Enterprise option

### Nginx Reverse Proxy (Production)

For production, use the provided `nginx.conf`:

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo cp nginx.conf /etc/nginx/sites-available/payroll-system
sudo ln -s /etc/nginx/sites-available/payroll-system /etc/nginx/sites-enabled/
sudo certbot --nginx -d your-domain.com
sudo nginx -t && sudo systemctl reload nginx
```

### CI/CD Pipeline

The `.github/workflows/ci-cd.yml` automatically:

1. **Builds & Tests** — Runs Maven tests on every push/PR
2. **Packages** — Creates JAR artifacts
3. **Builds Docker images** — For all 6 services
4. **Pushes to Docker Hub** — (requires `DOCKERHUB_USERNAME` & `DOCKERHUB_TOKEN` secrets)
5. **Deploys** — Runs `docker-compose up -d --build` on the server via SSH

### Quick Deploy Checklist

- [ ] Frontend: Deployed to Vercel/Netlify with `VITE_API_URL` set
- [ ] Backend: Docker Compose running on a server
- [ ] MySQL: Managed database created with schemas initialized
- [ ] Nginx: Configured as reverse proxy with SSL
- [ ] CI/CD: GitHub Actions secrets configured
- [ ] Domain: DNS pointed to server IP

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