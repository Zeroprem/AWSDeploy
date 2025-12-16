# Employee Management System

A full-stack Employee Management application built with **Spring Boot** (Java) backend and **Angular** frontend, using **MySQL** as the database.

## 📁 Project Structure

```
Full/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/employee/management/
│   │       │   ├── config/          # CORS configuration
│   │       │   ├── controller/      # REST controllers
│   │       │   ├── entity/          # JPA entities
│   │       │   ├── exception/       # Exception handling
│   │       │   ├── repository/      # Data repositories
│   │       │   ├── service/         # Business logic
│   │       │   └── EmployeeManagementApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── frontend/                # Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── employee-list/
    │   │   │   └── employee-form/
    │   │   ├── models/
    │   │   └── services/
    │   ├── styles.css
    │   └── index.html
    ├── angular.json
    └── package.json
```

## 🛠️ Prerequisites

Before running the application, ensure you have the following installed:

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and **npm 9+**
- **MySQL 8.0+**
- **Angular CLI** (optional, for development)

## 🗄️ Database Setup

### 1. Start MySQL Server

Make sure MySQL is running on your system.

### 2. Create Database

The database will be created automatically, but you can also create it manually:

```sql
CREATE DATABASE IF NOT EXISTS employee_db;
```

### 3. Configure Database Credentials

Update the database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```

Change `username` and `password` to match your MySQL credentials.

## 🚀 Running the Application

### Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build and run using Maven:
   ```bash
   mvn spring-boot:run
   ```

   Or build the JAR and run:
   ```bash
   mvn clean package
   java -jar target/management-1.0.0.jar
   ```

The backend will start at: **http://localhost:8080**

### Frontend (Angular)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   Or using Angular CLI:
   ```bash
   ng serve
   ```

The frontend will start at: **http://localhost:4200**

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

### Example Request Body (POST/PUT)

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "salary": 75000
}
```

### Example Response

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "salary": 75000
}
```

## ✨ Features

### Backend
- RESTful API with Spring Boot
- JPA/Hibernate for database operations
- MySQL database integration
- CORS enabled for Angular frontend
- Input validation
- Global exception handling
- Meaningful HTTP status codes

### Frontend
- Modern, responsive UI design
- Employee list with table view
- Add new employee form with validation
- Delete employees with confirmation
- Real-time list refresh after operations
- Loading states and error handling
- Beautiful dark theme with accent colors

## 🎨 UI Features

- **Dark Theme**: Modern dark color scheme with gradient backgrounds
- **Animated Interactions**: Smooth transitions and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Form Validation**: Real-time validation feedback
- **Department Badges**: Color-coded department labels
- **Success/Error Messages**: Clear feedback for user actions

## 🔧 Technology Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Data JPA
- Hibernate
- MySQL Connector
- Maven

### Frontend
- Angular 17
- TypeScript
- Reactive Forms
- HttpClient
- CSS3 with CSS Variables

## 📝 Notes

1. **CORS Configuration**: The backend is configured to accept requests from `http://localhost:4200` (Angular default port).

2. **Database Auto-Creation**: The database and tables are automatically created/updated when the application starts (using `spring.jpa.hibernate.ddl-auto=update`).

3. **Validation**: Both frontend and backend have validation for employee data.

4. **Error Handling**: Comprehensive error handling on both sides with user-friendly messages.

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify Java 17+ is installed

### Frontend won't connect to backend
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify API URL in `employee.service.ts`

### Database connection issues
- Check if MySQL is running: `mysql -u root -p`
- Verify the database exists: `SHOW DATABASES;`
- Check firewall settings

## 📄 License

This project is for educational purposes.

